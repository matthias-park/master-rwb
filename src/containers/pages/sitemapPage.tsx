import React, { useMemo, useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { useI18n } from '../../hooks/useI18n';
import Link from '../../components/Link';
import { PagesName } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import Accordion from 'react-bootstrap/Accordion';
import clsx from 'clsx';

interface SitemapListItem {
  path: string;
  children?: SitemapListItem[];
  name: string;
  emptyRoute?: boolean;
}

const insertSitemapChildren = (listItem: SitemapListItem, route) => {
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
    name: route.name,
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
  const { t } = useI18n();
  if (!t(`sitemap_${route.name}`)) return null;
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
        <div className="sitemap-accordion__item-title">
          {t(`sitemap_${route.name}`)}
        </div>
      ) : (
        <div className="sitemap-accordion__item-title">
          <Link to={route.path}>{t(`sitemap_${route.name}`)}</Link>
        </div>
      )}
      {route.children && (
        <Accordion.Collapse
          className="sitemap-accordion__item-body"
          eventKey={`key_${route.name}`}
        >
          <>
            {route.children?.map(subRoute => (
              <TreeItem
                route={subRoute}
                key={subRoute.path}
                active={active}
                setActive={setActive}
              />
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
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const sitemapList = useMemo(() => {
    const list: SitemapListItem[] = [];
    for (const route of [...routes].reverse()) {
      if (
        route.hiddenSitemap ||
        route.path === '/' ||
        (route.protected && !user.logged_in)
      )
        continue;
      if (
        user.logged_in &&
        [
          PagesName.ForgotLoginPage,
          PagesName.ForgotPasswordPage,
          PagesName.RegisterPage,
        ].includes(route.id)
      )
        continue;
      const mapItem = list.find(
        item => route.path.startsWith(item.path) && route.name !== item.name,
      );
      if (mapItem) {
        insertSitemapChildren(mapItem, route);
      } else {
        list.push({
          path: route.path,
          name: route.name,
          emptyRoute: route.id === PagesName.Null,
        });
      }
    }
    console.log(list);
    return list;
  }, [routes, user]);

  return (
    <main className="page-container">
      <div className="page-inner">
        <div className="pl-3 pl-lg-5 py-2 py-lg-3">
          <h1 className="mb-4">{t('sitemap_page_title')}</h1>
          <Accordion className="sitemap-accordion">
            {sitemapList.map(route => (
              <TreeItem
                key={route.path}
                route={route}
                active={activeItem}
                setActive={setActiveItem}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
};

export default SitemapPage;
