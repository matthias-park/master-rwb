import { SitemapStream } from 'sitemap';
import { Readable } from 'stream';
import logger from '../logger';
import { getCache, getRailsConstants } from '../utils';
import { Request, Response } from 'express';
import fetch from 'isomorphic-unfetch';

const getSitemap = async (req: Request, res: Response) => {
  const sitemap = await getCache(
    `${req.franchise.name}-sitemap`,
    7200000,
    async () => {
      const railsContants = await getRailsConstants(req);
      const locales = railsContants?.available_locales.map(lang => ({
        lang: lang.iso,
        url: `https://${req.hostname}/${lang.iso}`,
      }));
      const links: {
        url: string;
        links?: { lang: string; url: string }[];
      }[] = [];

      const promotionRoute = railsContants?.navigation_routes.find(
        route => route.id === 5 && !route.hiddenSitemap,
      )?.path;
      const promotions = {};

      if (promotionRoute) {
        for (const locale of locales) {
          const localePromotions: { slug: string }[] = await fetch(
            `${req.franchise.domains[0].api}/railsapi/v1/content/promotions`,
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
          if (route.hiddenSitemap || route.protected || route.redirectTo)
            continue;
          const localeLinks = otherLocaleLinks.map(link => ({
            ...link,
            url: `${link.url}${route.path}`,
          }));
          links.push({
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
            links.push({
              url: `${locale.url}${promoPath}`,
              links: localeLinks,
            });
          }
        }
      }
      return links;
    },
  );
  if (!sitemap) return res.sendStatus(404);
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
