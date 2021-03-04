import { Request } from 'express';
import { extensionsToIgnore } from './constants';

export const shouldPrerender = (req: Request) => {
  const prerenderHeader = req.headers['x-prerender'];
  if (!req.useragent || req.method !== 'GET' || prerenderHeader) return false;
  // Don't prerender media files
  if (
    extensionsToIgnore.some(
      extension => req.url.toLowerCase().indexOf(extension) !== -1,
    )
  )
    return false;
  if (req.useragent.isBot) return true;
};
