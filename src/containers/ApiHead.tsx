import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useConfig } from '../hooks/useConfig';
import { useLocation } from 'react-router-dom';
import SeoPages from '../types/api/content/SeoPages';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { useI18n } from '../hooks/useI18n';
import useApi from '../hooks/useApi';

const ApiHead = () => {
  const { locales, locale, routes, configLoaded } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const localesEqual = prev.locales.length === next.locales.length;
    const routesEqual = prev.routes.length === next.routes.length;
    const configLoadedEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && localesEqual && routesEqual && configLoadedEqual;
  });
  const { t } = useI18n();
  const { pathname, hash } = useLocation();
  const pathInfo = routes.find(
    route =>
      `${pathname}${hash}`.startsWith(route.path) || route.path === pathname,
  );
  const params = useMemo(
    () => ({
      slug: pathname,
    }),
    [pathname, locale],
  );
  const { data } = useApi<RailsApiResponse<SeoPages>>(
    configLoaded ? ['/railsapi/v1/content/seo_pages', params] : null,
    postApi,
    {
      errorRetryCount: 0,
    },
  );
  const seoData = data?.Success ? data?.Data : null;
  const fallbackTitle =
    t(`sitemap_${pathInfo?.name}`) +
    (t(`sitemap_${pathInfo?.name}`).length ? ' - ' : '') +
    t('seo_site_name');
  return (
    <>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>{seoData?.title || fallbackTitle}</title>
        <meta property="og:title" content={seoData?.title || fallbackTitle} />
        <meta
          name="description"
          content={seoData?.description || t('seo_description')}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content={t('seo_site_name')} />
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
      </Helmet>
      {!!seoData?.hidden_h1 && (
        <h1 style={{ display: 'none' }}>{seoData.hidden_h1}</h1>
      )}
    </>
  );
};
export default ApiHead;
