import { Request } from 'express';
import logger from './logger';
import redisCache from './redisCache';
import { PageConfig } from './types/PageConfig';
import SeoData from './types/seoData';
import { cacheKeys } from './utils';
import fetch from 'isomorphic-unfetch';
import { FRANCHISE_API_DOMAIN } from './constants';
import ContentPage from './types/ContentPage';
import { AbortController } from 'node-abort-controller';

interface RailsApiResponse<T> {
  Success: boolean;
  Code: number;
  Message: string | null;
  Data: T;
}

export const getWebConstants = async (
  req: Request,
): Promise<PageConfig | null> => {
  const cacheKey = cacheKeys(req.hostname).webConstants;
  let railsConstants = await redisCache.get<PageConfig>(cacheKey);
  if (!railsConstants) {
    logger.warn(`${req.hostname} - no rails constants cache`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    railsConstants = await fetch(
      `${FRANCHISE_API_DOMAIN}/restapi/v1/content/constants`,
      //@ts-ignore
      { signal: controller.signal },
    )
      .then(async res => {
        if (res.ok) {
          const data: RailsApiResponse<PageConfig> = await res.json();
          const constants = data.Data;
          if (!data.Success || !constants) return null;
          constants.locale = '{{{reqLocale}}}';
          return constants;
        }
        return null;
      })
      .catch(() => null);
    clearTimeout(timeoutId);
    if (railsConstants) {
      await redisCache.set(cacheKey, railsConstants);
    }
  }
  return railsConstants;
};

export const isPageContentPage = (req: Request) => req.routeData?.id === 15;

export const getWebContentPage = async (
  req: Request,
): Promise<ContentPage | null> => {
  if (!isPageContentPage) return null;
  const slug = req.routeData!.path.substring(1);
  const cacheKey = cacheKeys(req.hostname).contentPage(slug, req.locale!);
  let contentData = await redisCache.get<ContentPage>(cacheKey);
  if (!contentData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (req.locale) {
      headers['content-language'] = req.locale;
    }
    contentData = await fetch(
      `${FRANCHISE_API_DOMAIN}/restapi/v1/content/page/${slug}`,
      {
        method: 'GET',
        headers,
        //@ts-ignore
        signal: controller.signal,
      },
    )
      .then(async res => {
        if (res.ok) {
          const data: RailsApiResponse<ContentPage> = await res.json();
          if (data.Success && Object.keys(data.Data).length) {
            return data.Data;
          }
        }
        return null;
      })
      .catch(() => null);
    clearTimeout(timeoutId);
    if (contentData) {
      await redisCache.set(cacheKey, contentData);
    }
  }
  return contentData;
};
export const getWebPageSeo = async (req: Request): Promise<SeoData | null> => {
  const cacheKey = cacheKeys(req.hostname).pageSeo(req.path, req.locale!);
  let seoData = await redisCache.get<SeoData>(cacheKey);
  if (!seoData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (req.locale) {
      headers['content-language'] = req.locale;
    }
    seoData = await fetch(
      `${FRANCHISE_API_DOMAIN}/restapi/v1/content/seo_pages`,
      {
        method: 'POST',
        body: JSON.stringify({
          slug: req.path.replace(`/${req.locale}`, ''),
        }),
        headers,
        //@ts-ignore
        signal: controller.signal,
      },
    )
      .then(async res => {
        if (res.ok) {
          const data: RailsApiResponse<SeoData> = await res.json();
          return data.Data;
        }
        return null;
      })
      .catch(() => null);
    clearTimeout(timeoutId);
    if (seoData) {
      await redisCache.set(cacheKey, seoData);
    }
  }
  return seoData;
};

type Symbols = { [key: string]: string };
export const getWebTranslations = async (
  req: Request,
): Promise<Symbols | null> => {
  if (!req.locale) return null;
  const cacheKey = cacheKeys(req.hostname).translations(req.locale);
  let translations = await redisCache.get<Symbols>(cacheKey);
  if (!translations) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    translations = await fetch(
      `${FRANCHISE_API_DOMAIN}/restapi/v1/translations`,
      {
        headers: {
          'content-language': req.locale,
        },
        //@ts-ignore
        signal: controller.signal,
      },
    )
      .then(async res => {
        if (res.ok) {
          const data: RailsApiResponse<Symbols> = await res.json();
          data.Data._locale_ = req.locale!;
          return data.Data;
        }
        return null;
      })
      .catch(() => null);
    clearTimeout(timeoutId);
    if (translations) {
      await redisCache.set(cacheKey, translations);
    }
  }
  return translations;
};
