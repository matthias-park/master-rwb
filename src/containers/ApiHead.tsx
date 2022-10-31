import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useConfig } from '../hooks/useConfig';
import { useLocation, matchPath } from 'react-router-dom';
import SeoPages from '../types/api/content/SeoPages';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { useI18n } from '../hooks/useI18n';
import useApi from '../hooks/useApi';
import { usePrevious } from '../hooks';
import {
  CONTENT_PAGES,
  Franchise,
  PagesName,
  PAGES_WITH_CAPTCHA_ICON,
} from '../constants';
import clsx from 'clsx';
import { ConfigLoaded } from '../types/Config';

const ApiHead = () => {
  const { locale, routes, configLoaded, domLoaded } = useConfig(
    (prev, next) => {
      const localeEqual = prev.locale === next.locale;
      const routesEqual = prev.routes.length === next.routes.length;
      const configLoadedEqual = prev.configLoaded === next.configLoaded;
      const domLoadedEqual = prev.domLoaded === next.domLoaded;
      return localeEqual && routesEqual && configLoadedEqual && domLoadedEqual;
    },
  );
  const { t, hasTranslations } = useI18n();
  const [initRoute, setInitRoute] = useState(true);
  const { pathname, hash } = useLocation();
  const pathInfo = useMemo(() => {
    let pathRoute = routes.find(route => {
      const match = (path: string) =>
        matchPath(path, {
          path: route.path,
          exact: route.exact ?? true,
        });
      return match(`${pathname}${hash}`) || match(`${pathname}`);
    });
    if (pathRoute?.redirectTo) {
      pathRoute = routes.find(route => route.path === pathRoute!.redirectTo);
    }
    return pathRoute;
  }, [routes, pathname, hash]);
  const prevPathInfo = usePrevious(pathInfo);
  const params = useMemo(
    () => ({
      slug: pathname,
    }),
    [pathname, locale],
  );
  useEffect(() => {
    if (pathInfo && prevPathInfo && prevPathInfo.path !== pathInfo.path) {
      setInitRoute(false);
    }
  }, [pathname]);
  const { data } = useApi<RailsApiResponse<SeoPages>>(
    configLoaded === ConfigLoaded.Loaded && domLoaded && !initRoute
      ? ['/restapi/v1/content/seo_pages', params]
      : null,
    postApi,
    {
      errorRetryCount: 0,
    },
  );

  if (
    configLoaded !== ConfigLoaded.Loaded ||
    (pathname === window.location.pathname &&
      pathInfo?.id !== PagesName.LocaleSelectPage &&
      pathname !== '/')
  ) {
    return null;
  }

  const seoData = data?.Success ? data?.Data : null;
  const pathName = pathInfo?.name || prevPathInfo?.name || '';
  const pathNameTranslation =
    !CONTENT_PAGES.includes(pathInfo?.id || prevPathInfo?.id || 0) && pathname
      ? t(pathName, true)
      : '';
  const fallbackTitle =
    pathNameTranslation +
    (pathNameTranslation.length ? (Franchise.gnogaz ? ' | ' : ' - ') : '') +
    t('seo_site_name', true);
  const title = seoData?.title || (hasTranslations ? fallbackTitle : '');
  const bodyClassName = clsx(
    PAGES_WITH_CAPTCHA_ICON.includes(
      pathInfo?.id || prevPathInfo?.id || PagesName.Null,
    ) && 'show-captcha',
  );
  if (initRoute) {
    return null;
  }

  return (
    <>
      <Helmet
        title={title}
        defer={false}
        async
        htmlAttributes={{ lang: locale || undefined }}
      >
        <meta property="og:title" content={seoData?.title || fallbackTitle} />
        <meta
          name="description"
          content={seoData?.description || t('seo_description', true)}
        />
        {!!seoData?.keywords && (
          <meta name="keywords" content={seoData.keywords} />
        )}
        {!!seoData?.canonical_tag && (
          <link rel="canonical" href={seoData.canonical_tag} />
        )}
        <body className={bodyClassName} translate="no" />
      </Helmet>
      {!!seoData?.hidden_h1 && (
        <h1 style={{ display: 'none' }}>{seoData.hidden_h1}</h1>
      )}
    </>
  );
};
export default ApiHead;
