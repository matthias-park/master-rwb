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
  const { pathname } = useLocation();
  const params = useMemo(
    () => ({
      slug: pathname,
      locale,
    }),
    [pathname, locale],
  );
  const { data } = useSWR<RailsApiResponse<SeoPages>>(
    ['/railsapi/v1/content/seo_pages/fetch', params],
    postApi,
    {
      errorRetryCount: 0,
    },
  );
  const seoData = data?.Success ? data?.Data : null;
  return (
    <>
      <Helmet htmlAttributes={{ lang: locale }}>
        {!!seoData && (
          <>
            <title>{seoData.title}</title>
            {['description', 'keywords'].map(id => (
              <meta name={id} content={seoData[id]}></meta>
            ))}
            {!!seoData.canonical_tag && (
              <link rel="canonical" href={seoData.canonical_tag} />
            )}
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
