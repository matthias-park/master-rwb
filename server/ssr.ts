import { Request } from 'express';
import fs from 'fs';
import puppeteer, { Browser, HTTPRequest } from 'puppeteer';
import path from 'path';
import {
  BUILD_FOLDER,
  PRERENDER_HEADER,
  BROWSER_KEEP_ALIVE,
  HOLD_RENDERED_PAGE_INTERVAL,
  DOMAINS_TO_NAME,
  MAX_PRERENDER_PAGES,
} from './constants';
import logger from './logger';
import { getCache } from './utils';

export const getRenderedPage = async (req: Request): Promise<string | null> => {
  const cacheKey = req.url;
  const html = getCache(cacheKey, HOLD_RENDERED_PAGE_INTERVAL, async () =>
    render(req).catch(err => {
      logger.error(err);
      return null;
    }),
  );
  return html;
};

let browser: Browser | null = null;
let browserCloseTimeout: number = 0;
let openTabs = 0;
export const render = async (req: Request) => {
  if (!browser) {
    logger.info('Starting puppeteer');
    browser = await puppeteer.launch({
      args: ['--disable-web-security'],
      headless: true,
    });
  }
  if (openTabs > MAX_PRERENDER_PAGES) {
    throw new Error(`To many prerender requests - ${openTabs + 1} tabs open`);
  }
  logger.profile(`page rendered ${req.url}`);
  openTabs++;
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
    const allowlist = ['document', 'script', 'xhr', 'fetch'];
    if (!allowlist.includes(req.resourceType())) {
      return req.abort();
    }
    const blocklist = [
      'www.google-analytics.com',
      '/gtag/js',
      'ga.js',
      'analytics.js',
      'kambi.com',
      'kambi-widget-api.js',
      'kambi-bootstrap.js',
    ];
    if (blocklist.find(regex => req.url().match(regex))) {
      return req.abort();
    }
    const reqUrl = new URL(req.url());
    const frName = DOMAINS_TO_NAME[reqUrl.hostname];
    if (frName) {
      const jsFile = reqUrl.pathname.endsWith('.js');
      const contentType = `${
        jsFile ? 'application/javascript' : 'text/html'
      }; charset=UTF-8`;
      const filePath = path.join(
        BUILD_FOLDER,
        jsFile ? reqUrl.pathname : `/${frName}.html`,
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
  // .on('console', message =>
  //   console.log(
  //     `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`,
  //   ),
  // )
  // .on('requestfailed', request =>
  //   console.log(`${request.failure().errorText} ${request.url()}`),
  // );

  const fullUrl = buildReqUrl(req);
  await page.goto(fullUrl, {
    waitUntil: 'networkidle0',
  });
  //@ts-ignore
  const cache = await page.evaluate(() => window.PRERENDER_CACHE);
  let html = await page.content();
  html = html.replace(
    'window.PRERENDER_CACHE={}',
    `window.PRERENDER_CACHE=JSON.parse("${JSON.stringify(cache).replaceAll(
      '"',
      '\\"',
    )}")`,
  );
  openTabs--;
  await page.close();
  logger.profile(`page rendered ${req.url}`);
  if (browserCloseTimeout) clearTimeout(browserCloseTimeout);
  browserCloseTimeout = setTimeout(async () => {
    if (browser) {
      logger.info('Stopping puppeteer');
      await browser.close();
    }
  }, BROWSER_KEEP_ALIVE);
  return html;
  // return htmlCleanup(html);
};

const buildReqUrl = (req: Request) => {
  var protocol = req.secure ? 'https' : 'http';
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

const htmlCleanup = (html: string): string =>
  (html = html
    .replaceAll(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replaceAll(/<link[^>]+?as="script"[^>]*?>/gi, ''));
