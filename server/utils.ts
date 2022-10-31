import { Request } from 'express';
import {
  ASSETS_PATH,
  BUILD_FOLDER,
  DEVELOPMENT,
  extensionsToIgnore,
  FRANCHISE_CONFIG,
  INDEX_HTML_PATH,
} from './constants';
import { PageConfig } from './types/PageConfig';
import redisCache from './redisCache';
import path, { extname } from 'path';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import {
  getWebConstants,
  getWebContentPage,
  getWebPageSeo,
  getWebTranslations,
  isPageContentPage,
} from './apiUtils';
import crypto from 'crypto';
import logger from './logger';

interface ContentPages {
  [key: string]: string[];
}
export const getRailsConstants = async (
  req: Request,
): Promise<PageConfig | null> => {
  let railsConstants = await getWebConstants(req);
  if (railsConstants) {
    const navigation_routes =
      railsConstants.navigation_routes?.filter(
        route =>
          route.id !== 19 &&
          route.path !== '*' &&
          !route.externalLinkTranslation,
      ) || [];
    if (railsConstants.content_pages) {
      for (const [key, value] of Object.entries(
        railsConstants.content_pages as ContentPages,
      )) {
        const name = Array.isArray(value) ? value[0] : value;
        const slug = Array.isArray(value) ? value[1] : key;
        const contentPagePath = `${slug.startsWith('/') ? '' : '/'}${slug}`;
        if (!navigation_routes.some(route => route.path === contentPagePath)) {
          navigation_routes.push({
            id: 15,
            path: contentPagePath,
            name,
          });
        }
      }
    }
    return {
      ...railsConstants,
      navigation_routes,
    };
  }
  return null;
};
export const cacheKeys = (hostname: string) => ({
  webConstants: `${hostname}-webConstants`,
  sitemap: `${hostname}-sitemap`,
  pageSeo: (path: string, locale: string) =>
    `${hostname}-seo-${locale}-${path}`,
  translations: (locale: string) => `${hostname}-translations-${locale}`,
  html: (path: string, locale: string = '', hash: string | null = '') =>
    `${hostname}-html-${locale}-${path}-${hash}`,
  contentPage: (slug: string, locale: string) =>
    `${hostname}-contentpage-${locale}-${slug}`,
});

export const isReqResourceFile = (req: Request) => {
  const urlExt = extname(req.path);
  const hasExtension = !!urlExt.length && extensionsToIgnore.includes(urlExt);
  return hasExtension;
};

const getUseragentDevice = (req: Request) =>
  Object.entries(req.useragent || {})
    .filter(entry => !!entry[1])
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

const getWebConfig = (req: Request) => {
  const domainConfig =
    FRANCHISE_CONFIG.domains.find(domain =>
      req.hostname.includes(domain.hostname),
    ) || FRANCHISE_CONFIG.domains[0];
  const apiUrl = DEVELOPMENT ? '/api' : domainConfig.api;

  return {
    name: FRANCHISE_CONFIG.name,
    theme: FRANCHISE_CONFIG.theme,
    apiUrl: apiUrl,
    gtmId: FRANCHISE_CONFIG.gtmId,
    kambi: FRANCHISE_CONFIG.kambi,
    sbTechUrl: FRANCHISE_CONFIG.sbTechUrl,
    smartyStreets: FRANCHISE_CONFIG.smartyStreets,
    zendesk: FRANCHISE_CONFIG.zendesk,
    googleRecaptchaKey: FRANCHISE_CONFIG.googleRecaptchaKey,
    geoComplyKey: FRANCHISE_CONFIG.geoComplyKey,
    xtremepush: FRANCHISE_CONFIG.xtremepush,
    dateFormat: FRANCHISE_CONFIG.dateFormat,
    componentSettings: FRANCHISE_CONFIG.componentSettings,
    themeSettings: FRANCHISE_CONFIG.themeSettings,
    tgLabSb: FRANCHISE_CONFIG.tgLabSb,
    casino: FRANCHISE_CONFIG.casino,
    singleLoadPage: req.singleLoadPage,
    canadaPostAutoComplete: FRANCHISE_CONFIG.canadaPostAutoComplete,
    countryNotAllowed: req.countryNotAllowed,
    seoTitleSeperator: titleSeperator,
    ip: '{{{reqIP}}}',
    device: '{{{reqDevice}}}',
  };
};

const assets: { js: string[]; css: string[] } = (() => {
  let js = [];
  let css = [];
  try {
    const json = fs.readFileSync(ASSETS_PATH, 'utf-8');
    const data = JSON.parse(json);
    const mainBundle =
      data?.[`bundle-${FRANCHISE_CONFIG.theme}`] || data?.main || {};
    js = mainBundle.js || [];
    css = data?.[`theme-${FRANCHISE_CONFIG.theme}`]?.css || [];
    if (!Array.isArray(js)) js = [js];
    if (!Array.isArray(css)) css = [css];
    if (mainBundle.css) {
      const mainBundleCss = Array.isArray(mainBundle.css)
        ? mainBundle.css
        : [mainBundle.css];
      css = css.concat(mainBundleCss);
    }
  } catch (err) {
    logger.error(err);
  } finally {
    return { js, css };
  }
})();

const indexHtmlHash = (() => {
  try {
    let data = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
    if (!data) return null;
    data += fs.readFileSync(ASSETS_PATH, 'utf-8');
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
  } catch (err) {
    logger.error(err);
    return null;
  }
})();

const titleSeperator = FRANCHISE_CONFIG.seoTitleSeparator || ' - ';
export const formatHtmlResponse = async (
  req: Request,
): Promise<string | null> => {
  const pageHtmlCacheKey = cacheKeys(req.hostname).html(
    req.path,
    req.locale || '',
    indexHtmlHash,
  );
  let cachedHtml = await redisCache.get<string>(pageHtmlCacheKey);
  if (cachedHtml) {
    cachedHtml = cachedHtml
      .replace('{{{reqIP}}}', req.ip)
      .replace('"{{{reqDevice}}}"', JSON.stringify(getUseragentDevice(req)))
      .replace('"{{{reqLocale}}}"', JSON.stringify(req.locale || ''));
    return cachedHtml;
  }
  const dom = await JSDOM.fromFile(INDEX_HTML_PATH).catch(() => null);
  if (!dom) return null;

  const config = getWebConfig(req);
  const seoData = await getWebPageSeo(req);
  const constants = await getWebConstants(req);
  const translations = await getWebTranslations(req);
  const contentPage = isPageContentPage(req)
    ? await getWebContentPage(req)
    : null;
  let metas: { [key: string]: string | null | undefined } = {
    viewport: req.useragent?.isiPhone
      ? 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
      : null,
  };
  const contentPageTitle =
    contentPage?.structure?.content?.[0]?.standart?.page_title?.value ||
    contentPage?.structure?.content?.[0]?.section?.page_title?.value;
  const pageTitle =
    contentPageTitle ||
    seoData?.title ||
    (req.routeData && translations?.[req.routeData.name]
      ? translations?.[req.routeData!.name]
      : '');
  const siteName = translations?.seo_site_name || '';
  const title = `${pageTitle}${
    pageTitle.length ? titleSeperator : ''
  }${siteName}`;
  dom.window.document.title = title;
  metas = {
    ...metas,
    'theme-color': FRANCHISE_CONFIG.themeColor,
    'facebook-domain-verification': FRANCHISE_CONFIG.fbDomainVerification,
    'apple-itunes-app': FRANCHISE_CONFIG.appleAppMeta,
    'og:title': title,
    'twitter:title': title,
    description: seoData?.description ?? translations?.seo_description,
    'twitter:description':
      seoData?.description ?? translations?.seo_description,
    'og:type': 'website',
    'og:url': req.protocol + '://' + req.hostname + req.path,
    'og:site_name': translations?.seo_site_name,
    'og:image': '/assets/images/logo/logo.png',
    'twitter:image': '/assets/images/logo/logo.png',
    'twitter:card': 'summary_large_image',
    keywords: seoData?.keywords,
  };

  const insertTag = (
    type: 'link' | 'meta' | 'script',
    attr: { [key: string]: string },
  ) => {
    const linkEl = dom.window.document.createElement(type);
    Object.entries(attr).forEach(([key, value]) => {
      linkEl.setAttribute(key, value);
    });
    dom.window.document.head.appendChild(linkEl);
  };
  if (req.locale) {
    dom.window.document.documentElement.setAttribute('lang', req.locale);
  }
  assets.css.forEach(href => {
    insertTag('link', {
      href,
      rel: 'stylesheet',
    });
  });
  assets.js.forEach(src => {
    insertTag('script', {
      src,
      defer: 'defer',
    });
  });
  const configScript = dom.window.document.createElement('script');
  configScript.innerHTML = `window.__config__ = ${JSON.stringify({
    ...config,
    initPath: req.path,
    constants,
    translations,
    contentPage,
  })
    .replace(/<(\/?)(script)/gi, '\\u003c$1$2')
    .replace(/]]>/g, ']]\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/-->/g, '--\\u003e')};`;
  dom.window.document.head.appendChild(configScript);

  Object.entries(metas)
    .filter(meta => meta[1] != null && meta[1].length)
    .forEach(([key, value]) => {
      insertTag('meta', {
        name: key,
        content: value!,
      });
    });
  if (seoData?.canonical_tag) {
    insertTag('link', { rel: 'canonical', href: seoData.canonical_tag });
  }
  constants?.available_locales.forEach(locale => {
    if (req.locale === locale.iso) return;
    insertTag('link', {
      rel: 'alternate',
      hrefLang: locale.iso,
      href: req.protocol + '://' + req.get('host') + '/' + locale.iso,
    });
  });
  FRANCHISE_CONFIG.iconSizes?.forEach(icon => {
    insertTag('link', {
      rel: 'apple-touch-icon',
      sizes: `${icon}x${icon}`,
      href: `/assets/images/icons/${icon}px.png`,
    });
  });

  const assetsPath = path.join(BUILD_FOLDER, `/${FRANCHISE_CONFIG.name}`);
  if (!fs.existsSync(`${assetsPath}/loading-spinner.svg`)) {
    dom.window.document.getElementById('page-loading-spinner')?.remove();
    dom.window.document.getElementById('page-loading-spinner-script')?.remove();
    dom.window.document.getElementById('page-loading-spinner-styles')?.remove();
  }
  let html = dom.serialize();
  if (html) {
    if (!!seoData && !!constants && !!translations && req.pathExist) {
      await redisCache.set(pageHtmlCacheKey, html);
    }
    html = html
      .replace('{{{reqIP}}}', req.ip)
      .replace('"{{{reqDevice}}}"', JSON.stringify(getUseragentDevice(req)))
      .replace('"{{{reqLocale}}}"', JSON.stringify(req.locale || ''));
  }
  return html;
};
