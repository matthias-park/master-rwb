import React, { useMemo } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { useI18n } from '../../hooks/useI18n';
import Link from '../../components/Link';
import { PagesName } from '../../constants';
import { sortAscending } from '../../utils';
import { useAuth } from '../../hooks/useAuth';

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

const TreeItem = ({ route }: { route: SitemapListItem }) => {
  const { t } = useI18n();
  if (!t(`sitemap_${route.name}`)) return null;
  return (
    <li>
      {route.emptyRoute ? (
        <div>{t(`sitemap_${route.name}`)}</div>
      ) : (
        <Link to={route.path}>{t(`sitemap_${route.name}`)}</Link>
      )}
      {route.children?.map(subRoute => (
        <ul key={subRoute.path}>
          <TreeItem route={subRoute} />
        </ul>
      ))}
    </li>
  );
};

const SitemapPage = () => {
  const { t } = useI18n();
  const { routes } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );
  const { user } = useAuth();
  const sitemapList = useMemo(() => {
    const list: SitemapListItem[] = [];
    for (const route of routes.sort((a, b) =>
      sortAscending(a.path.length, b.path.length),
    )) {
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
    return list;
  }, [routes, user]);

  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4 pt-5">
      <h1 className="mb-4">{t('sitemap_page_title')}</h1>
      <ul>
        {sitemapList.map(route => (
          <TreeItem key={route.path} route={route} />
        ))}
      </ul>
    </main>
  );
};

export default SitemapPage;
