import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { useI18n } from '../../hooks/useI18n';

interface SitemapListItem {
  path: string;
  children?: SitemapListItem[];
  name: string;
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
  return (
    <li>
      <Link to={route.path}>{t(`sitemap_${route.name}`)}</Link>
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
  const { routes, user } = useConfig();

  const sitemapList = useMemo(() => {
    const list: SitemapListItem[] = [];
    for (const route of routes) {
      if (
        route.hiddenSitemap ||
        route.path === '/' ||
        (route.protected && !user.logged_in)
      )
        continue;
      const mapItem = list.find(item => route.path.startsWith(item.path));
      if (mapItem) {
        insertSitemapChildren(mapItem, route);
      } else {
        list.push({
          path: route.path,
          name: route.name,
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
