import { SitemapStream } from 'sitemap';
import { Readable } from 'stream';
import logger from '../logger';
import { cacheKeys, getRailsConstants } from '../utils';
import { Request, Response } from 'express';
import fetch from 'isomorphic-unfetch';
import redisCache from '../redisCache';

interface SitemapLink {
  url: string;
  links?: { lang: string; url: string }[];
}
const getSitemap = async (req: Request, res: Response) => {
  const reqCacheKeys = cacheKeys(req.hostname);
  let sitemap = await redisCache.get<SitemapLink[]>(req, reqCacheKeys.sitemap);
  if (!sitemap) {
    logger.info(`${req.hostname} - generating sitemap.xml`);
    const railsContants = await getRailsConstants(req);
    if (!railsContants) return res.sendStatus(404);

    const locales = railsContants?.available_locales.map(lang => ({
      lang: lang.iso,
      url: `https://${req.hostname}/${lang.iso}`,
    }));
    sitemap = [];
    const promotionRoute = railsContants?.navigation_routes.find(
      route => route.id === 5 && !route.hiddenSitemap,
    )?.path;
    const promotions = {};

    if (promotionRoute) {
      for (const locale of locales) {
        const localePromotions: { slug: string }[] = await fetch(
          `${req.franchise.domains[0].api}/restapi/v1/content/promotions`,
          {
            headers: {
              cookie: `user_locale=${locale.lang}`,
            },
          },
        ).then(async res => {
          if (res.ok) {
            const data = await res.json();
            return data?.Data || [];
          }
          return [];
        });
        promotions[locale.lang] = localePromotions.map(promo => promo.slug);
      }
    }
    for (const locale of locales) {
      const otherLocaleLinks = locales.filter(
        link => link.lang !== locale.lang,
      );
      for (const route of railsContants?.navigation_routes) {
        if (
          route.hiddenSitemap ||
          route.protected ||
          route.redirectTo ||
          route.id === 14
        )
          continue;
        const localeLinks = otherLocaleLinks.map(link => ({
          ...link,
          url: `${link.url}${route.path}`,
        }));
        sitemap.push({
          url: `${locale.url}${route.path}`,
          links: localeLinks,
        });
      }
      if (promotionRoute) {
        for (const promoSlug of promotions[locale.lang]) {
          const promoPath = `${promotionRoute}/${promoSlug}`;
          const localeLinks = otherLocaleLinks
            .filter(link => promotions[link.lang]?.includes(promoSlug))
            .map(link => ({
              ...link,
              url: `${link.url}${promoPath}`,
            }));
          sitemap.push({
            url: `${locale.url}${promoPath}`,
            links: localeLinks,
          });
        }
      }
    }
    if (sitemap) {
      await redisCache.set(req, reqCacheKeys.sitemap, sitemap);
    }
  }
  if (!sitemap) {
    logger.error(`${req.hostname} sitemap.xml not generated`);
    return res.sendStatus(404);
  }
  const stream = new SitemapStream({
    hostname: `https://${req.hostname}`,
    lastmodDateOnly: true,
  });
  Readable.from(sitemap).pipe(stream);
  res.header('Content-Type', 'application/xml');
  return stream.pipe(res).on('error', err => {
    logger.error(err);
  });
};

export default getSitemap;
