import { SitemapStream } from 'sitemap';
import { Readable } from 'stream';
import logger from '../logger';
import { getRailsConstants } from '../utils';
import { Request, Response } from 'express';

const getSitemap = async (req: Request, res: Response) => {
  const railsContants = await getRailsConstants(req);
  const nowDate = new Date();
  const links = railsContants?.navigation_routes
    ?.map(
      route =>
        !route.hiddenSitemap &&
        !route.protected && {
          url: route.path,
          changefreq: 'weekly',
          priority: 0.5,
          lastmod: nowDate,
        },
    )
    .filter(Boolean);
  if (!links) return res.sendStatus(404);
  const stream = new SitemapStream({
    hostname: req.hostname,
    lastmodDateOnly: true,
  });
  Readable.from(links).pipe(stream);
  res.header('Content-Type', 'application/xml');
  return stream.pipe(res).on('error', err => {
    logger.error(err);
  });
};

export default getSitemap;
