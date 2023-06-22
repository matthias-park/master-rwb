import React, { useState } from 'react';
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
import Spinner from 'react-bootstrap/Spinner';
import {
  StyledSitemapItem,
  StyledSitemapItemTitle,
  StyledSitemapItemToggle,
} from '../components/styled/StyledSitemap';

interface SitemapListItem {
  path: string;
  children?: SitemapListItem[];
  externalLink?: string;
  nameSymbol?: string;
  name?: string;
  emptyRoute?: boolean;
  order?: number;
  redirectTo?: string;
}

const insertSitemapChildren = (listItem: SitemapListItem, route) => {
  if (route.path === listItem.path) return;
  if (!listItem.children) {
    listItem.children = [];
  } else {
    const mapItem = listItem.children.find(item =>
      route.path.startsWith(item.path),
    );
    if (mapItem) {
      return insertSitemapChildren(mapItem, route);
    }
  }
  listItem.children.push({
    path: route.path,
    nameSymbol: route.nameSymbol,
    name: route.name,
    order: route.order,
    emptyRoute: route.id === PagesName.Null && !route.externalLinkTranslation,
    redirectTo: route.redirectTo,
    externalLink: route.externalLinkTranslation,
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
    <StyledSitemapItem>
      {route.children && (
        <Accordion.Toggle
          className={clsx(
            `icon-${window.__config__.name}-add`,
            active === `key_${route.name}` && 'active',
          )}
          as={StyledSitemapItemToggle}
          eventKey={`key_${route.name}`}
          onClick={() =>
            setActive(
              active === `key_${route.name}` ? null : `key_${route.name}`,
            )
          }
        ></Accordion.Toggle>
      )}
      {route.emptyRoute ? (
        <StyledSitemapItemTitle>{route.name}</StyledSitemapItemTitle>
      ) : (
        <StyledSitemapItemTitle>
          {route.externalLink ? (
            <a href={route.externalLink} target="_blank" rel="noreferrer">
              {route.name}
            </a>
          ) : (
            <Link to={route.redirectTo || route.path}>{route.name}</Link>
          )}
        </StyledSitemapItemTitle>
      )}
      {route.children && (
        <Accordion.Collapse
          className="sitemap-accordion__item-body"
          eventKey={`key_${route.name}`}
        >
          <>
            {route.children?.map(subRoute => (
              <Accordion key={subRoute.path} className="sitemap-accordion">
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
    </StyledSitemapItem>
  );
};

const SitemapPage = () => {
  const { t } = useI18n();
  const { routes, locale } = useConfig((prev, next) => {
    const routesEqual = prev.routes.length === next.routes.length;
    const localeEqual = prev.locale === next.locale;
    return routesEqual && localeEqual;
  });
  const { data: promotions } = useApi<RailsApiResponse<PostItem[]>>([
    '/restapi/v1/content/promotions?show_for=1',
    locale,
  ]);
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const sitemapList: SitemapListItem[] = [];
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
          PagesName.LoginPage,
        ].includes(route.id))
    )
      continue;
    const mapItem = sitemapList.find(
      item => route.path.startsWith(item.path) && route.name !== item.name,
    );
    if (mapItem) {
      insertSitemapChildren(mapItem, route);
    } else {
      sitemapList.push({
        path: route.path,
        nameSymbol: route.name,
        emptyRoute: route.id === PagesName.Null,
        order: route.order,
        redirectTo: route.redirectTo,
        externalLink: route.externalLinkTranslation,
      });
    }
  }
  if (promotions?.Data) {
    const promotionsPath = routes.find(
      route => route.id === PagesName.PromotionsPage && !route.hiddenSitemap,
    );
    const promotionsSitemapItem = sitemapList.find(
      item =>
        promotionsPath?.path.startsWith(item.path) &&
        promotionsPath?.name !== item.name,
    );
    if (promotionsSitemapItem) {
      for (const promotion of promotions.Data) {
        insertSitemapChildren(promotionsSitemapItem, {
          id: PagesName.TemplatePage,
          name: promotion.title,
          path: `${promotionsPath!.path}/${promotion.slug}`,
          order: promotion.priority,
        } as NavigationRoute);
      }
    }
  }
  return (
    <main className="page-container">
      <div className="page-inner">
        <div className="pl-3 pl-lg-5 py-2 py-lg-3">
          <h1 className="mb-4">{t('sitemap_page_title')}</h1>
          {user.loading && (
            <div className="d-flex justify-content-center pt-4 pb-3">
              <Spinner animation="border" className="spinner-custom mx-auto" />
            </div>
          )}
          {sitemapList
            .sort((a, b) => sortAscending(a.order || 999, b.order || 999))
            .map(route => (
              <Accordion key={route.path} className="sitemap-accordion">
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
