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
    CACHE[key] = {
      cachedTime: new Date().getTime(),
      data,
    };
    return data;
  });
};

export const getRailsConstants = (req: Request) =>
  // 2 hour cache
  getCache(`${req.franchise.name}-rails-constants`, 7200000, () =>
    fetch(`${req.franchise.api}/railsapi/v1/content/constants`).then(
      async res => {
        if (res.ok) {
          const data = await res.json();
          const navigation_routes = data.Data.navigation_routes.filter(
            route => route.id !== 14 && route.path !== '*',
          );
          for (const page of data.Data.content_pages) {
            navigation_routes.push({
              id: 15,
              path: `/${page}`,
              name: page,
            });
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
