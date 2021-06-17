import { Request } from 'express';
import { extensionsToIgnore, PRERENDER_HEADER } from './constants';
import fetch from 'isomorphic-unfetch';

export const shouldPrerender = (req: Request) => {
  const prerenderHeader = req.headers[PRERENDER_HEADER];
  if (!req.useragent || req.method !== 'GET' || prerenderHeader) return false;
  // Don't prerender static files
  if (
    extensionsToIgnore.some(
      extension => req.url.toLowerCase().indexOf(extension) !== -1,
    )
  )
    return false;
  return req.useragent.isBot;
};

const CACHE: { [key: string]: { cachedTime: number; data: any } } = {};
export const getCache = <T>(
  key: string,
  ttl: number,
  getData: () => Promise<T>,
): Promise<T> => {
  if (CACHE[key] && new Date().getTime() - CACHE[key].cachedTime < ttl) {
    return Promise.resolve(CACHE[key].data);
  }
  return getData().then(data => {
    if (data) {
      CACHE[key] = {
        cachedTime: new Date().getTime(),
        data,
      };
    }
    return data;
  });
};

interface ContentPages {
  [key: string]: string[];
}
export const getRailsConstants = (req: Request) =>
  // 2 hour cache
  getCache(`${req.franchise.name}-rails-constants`, 7200000, () =>
    fetch(`${req.franchise.domains[0].api}/railsapi/v1/content/constants`).then(
      async res => {
        if (res.ok) {
          const data = await res.json();
          if (!data?.Data?.navigation_routes) return null;
          const navigation_routes = data.Data.navigation_routes.filter(
            route =>
              ![14, 19].includes(route.id) &&
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
      },
    ),
  );
