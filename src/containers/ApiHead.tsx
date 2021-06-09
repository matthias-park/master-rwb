import React, { useMemo } from 'react';
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
  PagesName,
  PAGES_WITH_CAPTCHA_ICON,
} from '../constants';
import clsx from 'clsx';
import { ConfigLoaded } from '../types/Config';

const ApiHead = () => {
  const { locales, locale, routes, configLoaded } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const localesEqual = prev.locales.length === next.locales.length;
    const routesEqual = prev.routes.length === next.routes.length;
    const configLoadedEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && localesEqual && routesEqual && configLoadedEqual;
  });
  const { t, hasTranslations } = useI18n();
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
  const { data } = useApi<RailsApiResponse<SeoPages>>(
    configLoaded === ConfigLoaded.Loaded
      ? ['/railsapi/v1/content/seo_pages', params]
      : null,
    postApi,
    {
      errorRetryCount: 0,
    },
  );

  if (configLoaded !== ConfigLoaded.Loaded) {
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
    (pathNameTranslation.length ? ' - ' : '') +
    t('seo_site_name', true);
  const title = seoData?.title || (hasTranslations ? fallbackTitle : '');
  const bodyClassName = clsx(
    PAGES_WITH_CAPTCHA_ICON.includes(
      pathInfo?.id || prevPathInfo?.id || PagesName.Null,
    ) && 'show-captcha',
  );

  return (
    <>
      <Helmet
        title={title}
        defer={false}
        async
        htmlAttributes={{ lang: locale }}
      >
        <meta property="og:title" content={seoData?.title || fallbackTitle} />
        <meta
          name="description"
          content={seoData?.description || t('seo_description', true)}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content={t('seo_site_name', true)} />
        <meta property="og:image" content="/assets/images/logo/logo.png" />
        {!!seoData?.keywords && (
          <meta name="keywords" content={seoData.keywords} />
        )}
        {!!seoData?.canonical_tag && (
          <link rel="canonical" href={seoData.canonical_tag} />
        )}
        {locales.map(lang => {
          if (lang.iso === locale) return null;
          return (
            <link
              key={lang.id}
              rel="alternate"
              hrefLang={lang.iso}
              href={`${window.location.origin}/${lang.iso}`}
            />
          );
        })}
        <body className={bodyClassName} />
      </Helmet>
      {!!seoData?.hidden_h1 && (
        <h1 style={{ display: 'none' }}>{seoData.hidden_h1}</h1>
      )}
    </>
  );
};
export default ApiHead;
