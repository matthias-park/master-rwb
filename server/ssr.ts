import { Request } from 'express';
import fs from 'fs';
import puppeteer, { Browser, HTTPRequest } from 'puppeteer';
import path from 'path';
import {
  BUILD_FOLDER,
  PRERENDER_HEADER,
  BROWSER_KEEP_ALIVE,
  MAX_PRERENDER_PAGES,
} from './constants';
import logger from './logger';
import redisCache from './redisCache';
import { cacheKeys } from './utils';

let openTabs = 0;
export const getRenderedPage = async (req: Request): Promise<string | null> => {
  const cacheKey = `${cacheKeys(req.hostname).prerender}${req.url}`;
  let html = await redisCache.get<string>(req, cacheKey);
  if (!html && openTabs < MAX_PRERENDER_PAGES) {
    openTabs++;
    const profileId = `${req.hostname} - page rendered ${req.url}`;
    logger.profile(profileId);
    html = await render(req).catch(err => {
      logger.error(err);
      return null;
    });
    logger.profile(profileId);
    openTabs--;
    if (html) {
      await redisCache.set(req, cacheKey, html);
    }
  }
  return html;
};

let browser: Browser | null = null;
let browserCloseTimeout: number = 0;
export const render = async (req: Request) => {
  if (!browser) {
    logger.info('Starting puppeteer');
    browser = await puppeteer.launch({
      args: ['--disable-web-security'],
      headless: true,
    });
  }
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    [PRERENDER_HEADER]: 'true',
  });
  await page.setViewport({
    width: req.useragent?.isMobile ? 375 : 1920,
    height: req.useragent?.isMobile ? 667 : 1080,
  });
  await page.setRequestInterception(true);
  page.on('request', (req: HTTPRequest) => {
    const allowlist = ['document', 'script', 'xhr', 'fetch', 'stylesheet'];
    if (!allowlist.includes(req.resourceType())) {
      return req.abort();
    }
    const blocklist = [
      'www.google-analytics.com',
      '/gtag/js',
      'ga.js',
      'gtm.js',
      'analytics.js',
      'kambi.com',
      'kambi-widget-api.js',
      'kambi-bootstrap.js',
      'gstatic',
    ];
    if (blocklist.find(regex => req.url().match(regex))) {
      return req.abort();
    }
    const reqUrl = new URL(req.url());
    if (reqUrl.hostname) {
      const jsFile = reqUrl.pathname.endsWith('.js');
      const cssFile = reqUrl.pathname.endsWith('.css');
      const contentType = `${
        jsFile ? 'application/javascript' : cssFile ? 'text/css' : 'text/html'
      }; charset=UTF-8`;
      const hostname = reqUrl.hostname.replace('www.', '');
      const filePath = path.join(
        BUILD_FOLDER,
        jsFile || cssFile ? reqUrl.pathname : `/${hostname}.html`,
      );
      if (fs.existsSync(filePath)) {
        return req.respond({
          headers: {},
          status: 200,
          contentType,
          body: fs
            .readFileSync(filePath, 'utf-8')
            .replace(
              '</head>',
              '<script>window.PRERENDER_CACHE={};</script></head>',
            ),
        });
      }
    }
    req.continue();
  });

  const lang = req.url.split('/')?.[1] || '';
  const currentHostnameApi = req.franchise.domains
    .find(domain => domain.hostname === req.hostname.replace('www.', ''))
    ?.api?.replace('https://', '');

  if (currentHostnameApi) {
    await page.setCookie({
      name: 'user_locale',
      value: lang,
      domain: currentHostnameApi,
    });
  }

  const fullUrl = buildReqUrl(req);
  await page.goto(fullUrl, {
    waitUntil: ['networkidle0', 'domcontentloaded'],
  });
  await page
    .waitForSelector('#page-loading-spinner', { hidden: true })
    .catch(async () => {
      await page.close();
    });
  const cache = await page.evaluate(() => {
    window.localStorage.clear();
    //@ts-ignore
    return window.PRERENDER_CACHE;
  });
  let html = await page.content();
  html = html.replace(
    'window.PRERENDER_CACHE={}',
    `window.PRERENDER_CACHE=JSON.parse("${JSON.stringify(cache).replace(
      /"/g,
      '\\"',
    )}")`,
  );
  await page.close();
  if (browserCloseTimeout) clearTimeout(browserCloseTimeout);
  browserCloseTimeout = setTimeout(async () => {
    if (browser) {
      logger.info('Stopping puppeteer');
      await browser.close();
      browser = null;
    }
  }, BROWSER_KEEP_ALIVE);
  return html;
};

const buildReqUrl = (req: Request) => {
  var protocol = 'https';
  const cfVisitorHeader = req.header('cf-visitor');
  if (cfVisitorHeader) {
    var match = cfVisitorHeader.match(/"scheme":"(http|https)"/);
    if (match) protocol = match[1];
  }
  const forwardedProto = req.header('x-forwarded-proto');
  if (forwardedProto) {
    protocol = forwardedProto.split(',')[0];
  }
  return (
    protocol +
    '://' +
    (req.headers['x-forwarded-host'] || req.headers['host']) +
    req.url
  );
};
