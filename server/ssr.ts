import { Request } from 'express';
import fs from 'fs';
import puppeteer, { Browser, HTTPRequest } from 'puppeteer';
import path from 'path';
import { BUILD_FOLDER, PRERENDER_HEADER } from './constants';
import {
  BROWSER_KEEP_ALIVE,
  HOLD_RENDERED_PAGE_INTERVAL,
  DOMAINS_TO_NAME,
} from './constants';

const RENDERED_PAGES_CACHE: {
  [key: string]: { html: string; date: number };
} = {};

export const getRenderedPage = async (req: Request): Promise<string | null> => {
  const cacheKey = req.url;
  const cachedPage = RENDERED_PAGES_CACHE[cacheKey];
  if (
    cachedPage &&
    new Date().getTime() - cachedPage.date < HOLD_RENDERED_PAGE_INTERVAL
  ) {
    return cachedPage.html;
  }
  const html = await render(req).catch(err => {
    console.log(err);
    return null;
  });
  if (html) {
    RENDERED_PAGES_CACHE[cacheKey] = { html, date: new Date().getTime() };
    return html;
  }
  return null;
};

let browser: Browser | null = null;
let browserCloseTimeout: number = 0;

export const render = async (req: Request) => {
  if (!browser) {
    browser = await puppeteer.launch({
      args: ['--disable-web-security'],
      headless: true,
    });
  }
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    PRERENDER_HEADER: 'true',
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
    ];
    if (blocklist.find(regex => req.url().match(regex))) {
      return req.abort();
    }
    const reqUrl = new URL(req.url());
    const frName = DOMAINS_TO_NAME[reqUrl.hostname];
    if (frName && reqUrl.pathname.endsWith('.js')) {
      return req.respond({
        headers: {},
        status: 200,
        contentType: 'application/javascript; charset=UTF-8',
        body: fs.readFileSync(
          path.join(BUILD_FOLDER, reqUrl.pathname),
          'utf-8',
        ),
      });
    }
    req.continue();
  });

  const fullUrl = buildReqUrl(req);
  await page.goto(fullUrl, {
    waitUntil: 'networkidle0',
  });
  let html = await page.content();
  await page.close();
  if (browserCloseTimeout) clearTimeout(browserCloseTimeout);
  browserCloseTimeout = setTimeout(async () => {
    if (browser) {
      await browser.close();
    }
  }, BROWSER_KEEP_ALIVE);

  return htmlCleanup(html);
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
