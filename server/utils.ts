import { Request } from 'express';
import {
  EXCLUDED_BOTS,
  extensionsToIgnore,
  PRERENDER_HEADER,
} from './constants';
import fetch from 'isomorphic-unfetch';
import { PageConfig } from './types/PageConfig';
import redisCache from './redisCache';
import logger from './logger';

export const shouldPrerender = (req: Request) => {
  const prerenderHeader = req.headers[PRERENDER_HEADER];
  if (!req.useragent || req.method !== 'GET' || prerenderHeader) return false;
  const isBot: boolean | string = req.useragent.isBot;
  // Don't prerender static files or excluded bots
  if (
    extensionsToIgnore.some(
      extension => req.url.toLowerCase().indexOf(extension) !== -1,
    ) ||
    (typeof isBot === 'string' && EXCLUDED_BOTS.includes(isBot))
  )
    return false;
  return isBot;
};

interface ContentPages {
  [key: string]: string[];
}
export const getRailsConstants = async (
  req: Request,
): Promise<PageConfig | null> => {
  const cacheKey = cacheKeys(req.hostname).constants;
  let railsConstants = await redisCache.get<PageConfig>(req, cacheKey);
  if (!railsConstants) {
    logger.warn(`${req.hostname} - no rails constants cache`);
    railsConstants = await fetch(
      `${req.franchise.domains[0].api}/restapi/v1/content/constants`,
    )
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          if (!data.Success) return null;
          if (!data?.Data?.navigation_routes) return null;
          const navigation_routes = data.Data.navigation_routes.filter(
            route =>
              route.id !== 19 &&
              route.path !== '*' &&
              !route.externalLinkTranslation,
          );
          if (data.Data.content_pages) {
            for (const [key, value] of Object.entries(
              data.Data.content_pages as ContentPages,
            )) {
              const name = Array.isArray(value) ? value[0] : value;
              const slug = Array.isArray(value) ? value[1] : key;
              const contentPagePath = `${
                slug.startsWith('/') ? '' : '/'
              }${slug}`;
              if (
                !navigation_routes.some(route => route.path === contentPagePath)
              ) {
                navigation_routes.push({
                  id: 15,
                  path: contentPagePath,
                  name,
                });
              }
            }
          }
          return {
            ...data.Data,
            navigation_routes,
          };
        }
        return null;
      })
      .catch(() => null);
    if (railsConstants) {
      await redisCache.set(req, cacheKey, railsConstants);
    }
  }
  return railsConstants;
};
export const cacheKeys = (hostname: string) => ({
  constants: `${hostname}-constants`,
  prerender: `${hostname}-prerender-`,
  sitemap: `${hostname}-sitemap`,
});
