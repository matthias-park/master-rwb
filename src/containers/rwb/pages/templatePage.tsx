import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useUIConfig } from '../../../hooks/useUIConfig';
import { useI18n } from '../../../hooks/useI18n';
import { useParams, useLocation } from 'react-router-dom';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import clsx from 'clsx';
import RedirectNotFound from '../../../components/RedirectNotFound';
import ContentPage from '../../../types/api/content/ContentPage';
import { useConfig } from '../../../hooks/useConfig';
import { Helmet } from 'react-helmet-async';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
import { getApi } from '../../../utils/apiUtils';
import { Config } from '../../../constants';

const TemplatePage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { locale, mobileView, customContentPages } = useConfig(
    (prev, next) => prev.locale === next.locale,
  );
  const { pathname } = useLocation();
  const page = slug || pathname.substring(1);
  const { headerNav } = useUIConfig();
  const { t } = useI18n();
  const { data, error } = useApi<RailsApiResponse<ContentPage>>(
    [`/restapi/v1/content/page/${page}`, locale],
    url => getApi(url, { cache: 'no-store' }),
  );
  const isDataLoading = !data && !error;
  const isCustomContentPage = customContentPages?.includes(page);

  if (!isDataLoading && (error || !data?.Success)) {
    return <RedirectNotFound />;
  }

  const pageTitle =
    data?.Data?.structure?.content?.[0]?.standart?.page_title?.value ||
    data?.Data?.structure?.content?.[0]?.section?.page_title?.value;

  return (
    <>
      {isDataLoading && (
        <div
          className={clsx(
            'd-flex justify-content-center py-5 mx-auto min-vh-70',
            headerNav.active && 'pt-xl-4',
          )}
        >
          <Spinner animation="border" className="spinner-custom mx-auto mt-5" />
        </div>
      )}
      {!!pageTitle && (
        <Helmet
          title={`${pageTitle}${Config.seoTitleSeperator}${t('seo_site_name')}`}
          defer={false}
          async
        />
      )}
      {!!data?.Success && (
        <main
          className={clsx(
            isCustomContentPage || mobileView
              ? 'custom-content-page'
              : 'container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5',
          )}
        >
          {pageTitle && !mobileView && (
            <h1 className="account-settings__title">{pageTitle}</h1>
          )}
          <div className={clsx(!isCustomContentPage && 'outer-info-block')}>
            {data.Data.structure.content.slice(1).map((el, index) => (
              <div className="mb-3">
                {!!el.section?.section_title?.value && (
                  <strong>{el.section?.section_title?.value}</strong>
                )}
                {!!el.section?.section_content?.value && (
                  <p>
                    {replaceStringTagsReact(el.section.section_content.value)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </main>
      )}
    </>
  );
};

export default TemplatePage;
