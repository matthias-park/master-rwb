import React, { useMemo, useState } from 'react';
import { useConfig } from '../../../hooks/useConfig';
import { useI18n } from '../../../hooks/useI18n';
import Link from '../../../components/Link';
import { PagesName } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import Accordion from 'react-bootstrap/Accordion';
import clsx from 'clsx';
import useApi from '../../../hooks/useApi';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { PostItem } from '../../../types/api/Posts';
import { NavigationRoute } from '../../../types/api/PageConfig';
import { sortAscending } from '../../../utils';

interface SitemapListItem {
  path: string;
  children?: SitemapListItem[];
  name: string;
  emptyRoute?: boolean;
  order?: number;
}

const pagesWithTranslatedName = [
  PagesName.TemplatePage,
  PagesName.FaqPage,
  PagesName.ResponsibleGamingPage,
];

const insertSitemapChildren = (listItem: SitemapListItem, route, t) => {
  if (route.path === listItem.path) return;
  if (!listItem.children) {
    listItem.children = [];
  } else {
    const mapItem = listItem.children.find(item =>
      route.path.startsWith(item.path),
    );
    if (mapItem) {
      return insertSitemapChildren(mapItem, route, t);
    }
  }
  const pageName = pagesWithTranslatedName.includes(route.id)
    ? route.name
    : t(`${route.externalLinkTranslation ? '' : 'sitemap_'}${route.name}`);
  listItem.children.push({
    path: route.path,
    name: pageName,
    order: route.order,
  });
};

const TreeItem = ({
  route,
  active,
  setActive,
}: {
  route: SitemapListItem;
  active: string | null;
  setActive: (active: string | null) => void;
}) => {
  if (route.emptyRoute && !route.children) return null;

  return (
    <div className="sitemap-accordion__item">
      {route.children && (
        <Accordion.Toggle
          className={clsx(
            'sitemap-accordion__item-toggle icon-add',
            active === `key_${route.name}` && 'active',
          )}
          as="i"
          eventKey={`key_${route.name}`}
          onClick={() =>
            setActive(
              active === `key_${route.name}` ? null : `key_${route.name}`,
            )
          }
        ></Accordion.Toggle>
      )}
      {route.emptyRoute ? (
        <div className="sitemap-accordion__item-title">{route.name}</div>
      ) : (
        <div className="sitemap-accordion__item-title">
          <Link to={route.path}>{route.name}</Link>
        </div>
      )}
      {route.children && (
        <Accordion.Collapse
          className="sitemap-accordion__item-body"
          eventKey={`key_${route.name}`}
        >
          <>
            {route.children?.map(subRoute => (
              <Accordion className="sitemap-accordion">
                <TreeItem
                  route={subRoute}
                  key={subRoute.path}
                  active={active}
                  setActive={setActive}
                />
              </Accordion>
            ))}
          </>
        </Accordion.Collapse>
      )}
    </div>
  );
};

const SitemapPage = () => {
  const { t } = useI18n();
  const { routes } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );
  const { data: promotions } = useApi<RailsApiResponse<PostItem[]>>(
    '/railsapi/v1/content/promotions',
  );
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const sitemapList = useMemo(() => {
    const list: SitemapListItem[] = [];
    for (const route of [...routes].reverse()) {
      if (
        route.hiddenSitemap ||
        route.path === '/' ||
        (route.protected && !user.logged_in) ||
        route.id === PagesName.NotFoundPage ||
        (user.logged_in &&
          [
            PagesName.ForgotLoginPage,
            PagesName.ForgotPasswordPage,
            PagesName.RegisterPage,
          ].includes(route.id))
      )
        continue;
      const mapItem = list.find(
        item => route.path.startsWith(item.path) && route.name !== item.name,
      );
      if (mapItem) {
        insertSitemapChildren(mapItem, route, t);
      } else {
        const pageName = pagesWithTranslatedName.includes(route.id)
          ? route.name
          : t(
              `${route.externalLinkTranslation ? '' : 'sitemap_'}${route.name}`,
            );
        list.push({
          path: route.path,
          name: pageName,
          emptyRoute: route.id === PagesName.Null,
          order: route.order,
        });
      }
    }
    if (promotions?.Data) {
      const promotionsPath = routes.find(
        route => route.id === PagesName.PromotionsPage && !route.hiddenSitemap,
      );
      const promotionsSitemapItem = list.find(
        item =>
          promotionsPath?.path.startsWith(item.path) &&
          promotionsPath?.name !== item.name,
      );
      if (promotionsSitemapItem) {
        for (const promotion of promotions.Data) {
          insertSitemapChildren(
            promotionsSitemapItem,
            {
              id: PagesName.TemplatePage,
              name: promotion.title,
              path: `${promotionsPath!.path}/${promotion.slug}`,
              order: promotion.priority,
            } as NavigationRoute,
            t,
          );
        }
      }
    }
    return list;
  }, [routes, user, promotions]);

  return (
    <main className="page-container">
      <div className="page-inner">
        <div className="pl-3 pl-lg-5 py-2 py-lg-3">
          <h1 className="mb-4">{t('sitemap_page_title')}</h1>
          {sitemapList
            .sort((a, b) => sortAscending(a.order || 999, b.order || 999))
            .map(route => (
              <Accordion className="sitemap-accordion">
                <TreeItem
                  key={route.path}
                  route={route}
                  active={activeItem}
                  setActive={setActiveItem}
                />
              </Accordion>
            ))}
        </div>
      </div>
    </main>
  );
};

export default SitemapPage;
