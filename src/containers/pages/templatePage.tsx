import React, { useEffect } from 'react';
import useSWR from 'swr';
import Spinner from 'react-bootstrap/Spinner';
import JsonPage from '../../types/api/JsonPage';
import { makeCollapsible } from '../../utils/uiUtils';
import { useParams, useLocation } from 'react-router-dom';
import NotFoundPage from './notFoundPage';
import Sidebar from '../../components/Sidebar';
import RailsApiResponse from '../../types/api/RailsApiResponse';

const infoPages = [
  {
    name: 'info_faq_title',
    link: '/faq',
  },
  {
    name: 'betting_rules_title',
    link: '/betting-rules',
  },
];

const TemplatePage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { pathname } = useLocation();
  const page = slug || pathname.substring(1).replaceAll('/', '_');
  const { data, error } = useSWR<RailsApiResponse<JsonPage>>(
    `/railsapi/v1/content/page/${page}`,
  );
  const isDataLoading = !data && !error;

  useEffect(() => {
    makeCollapsible('card', 'collapse', 'card-header');
  }, [data]);

  if (error || !data?.Success) {
    return <NotFoundPage />;
  }

  return (
    <div className="page-container">
      {infoPages.some(link => link.link === pathname) && (
        <Sidebar links={infoPages}></Sidebar>
      )}
      <main className="container-fluid px-3 pr-sm-4 pl-sm-5 my-4">
        {isDataLoading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        )}
        {!!data && (
          <>
            <h1 className="mb-4">{data.Data.title || data.Data.headline}</h1>
            {!!data.Data.body && (
              <div dangerouslySetInnerHTML={{ __html: data.Data.body }} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TemplatePage;
