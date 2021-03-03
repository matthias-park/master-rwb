import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useConfig } from '../hooks/useConfig';
import { useLocation } from 'react-router-dom';
import useSWR from 'swr';
import SeoPages from '../types/api/content/SeoPages';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';

const ApiHead = () => {
  const { locale } = useConfig();
  // const { t } = useI18n();
  const { pathname } = useLocation();
  // const pathInfo = routes.find(route => route.path === pathname);
  const params = useMemo(
    () => ({
      slug: pathname,
      locale,
    }),
    [pathname, locale],
  );
  const { data } = useSWR<RailsApiResponse<SeoPages>>(
    ['/railsapi/v1/content/seo_pages', params],
    postApi,
    {
      errorRetryCount: 0,
    },
  );
  const seoData = data?.Success ? data?.Data : null;
  // const fallbackTitle =
  //   t(`sitemap_${pathInfo?.name}`) + ' - ' + t('seo_site_name');
  return (
    <>
      <Helmet htmlAttributes={{ lang: locale }}>
        {!!seoData ? (
          <>
            <title>{seoData.title} </title>
            {['description', 'keywords'].map(id => (
              <meta key={id} name={id} content={seoData[id]} />
            ))}
            {!!seoData.canonical_tag && (
              <link rel="canonical" href={seoData.canonical_tag} />
            )}
          </>
        ) : (
          <>
            {/* <title>{fallbackTitle}</title>
            <meta name="description" content={t('seo_description')} /> */}
          </>
        )}
      </Helmet>
      {!!seoData?.hidden_h1 && (
        <h1 style={{ display: 'none' }}>{seoData.hidden_h1}</h1>
      )}
    </>
  );
};
export default ApiHead;
