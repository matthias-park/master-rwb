import React from 'react';
import useSWR from 'swr';
import Spinner from 'react-bootstrap/Spinner';
import { useI18n } from '../../hooks/useI18n';
import JsonPage from '../../types/api/JsonPage';
import { useParams } from 'react-router-dom';
import NotFoundPage from './notFoundPage';

const TemplatePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, error } = useSWR<JsonPage>(`/${slug}.json?response_json=true`);
  const isDataLoading = !data && !error;
  if (error) {
    return <NotFoundPage />;
  }
  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!data && (
        <>
          <h1 className="mb-4">{data.title || data.headline}</h1>
          {!!data.text && (
            <div dangerouslySetInnerHTML={{ __html: data.text }} />
          )}
        </>
      )}
    </main>
  );
};

export default TemplatePage;
