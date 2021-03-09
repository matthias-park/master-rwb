import { Request } from 'express';
import { extensionsToIgnore, PRERENDER_HEADER } from './constants';

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
