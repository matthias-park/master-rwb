import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Redirect } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { Tab, Tabs } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { PostItem } from '../../types/api/Posts';
import Spinner from 'react-bootstrap/Spinner';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useApi from '../../hooks/useApi';
import Link from '../../components/Link';
import JsonPage from '../../types/api/JsonPage';
import { makeCollapsible } from '../../utils/uiUtils';
import { useConfig } from '../../hooks/useConfig';
import { PagesName } from '../../constants';

const PromoItem = ({ item }: { item: PostItem }) => {
  const { pathname } = useLocation();
  const slug = new URL(item.alternative_url).pathname; //getPath();
  const LinkEl = ({ children }) =>
    item.use_alternative_url ? (
      <Link to={`${pathname}${slug}`}>{children}</Link>
    ) : (
      children
    );
  return (
    <Card className="mx-1 mt-1">
      <LinkEl>
        <Card.Img
          variant="top"
          height={300}
          width={300}
          style={{ height: 300, width: 300 }}
          src={item.image.thumb_300_300.url ?? undefined}
        />
      </LinkEl>
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Card.Body>{item.body}</Card.Body>
      </Card.Body>
    </Card>
  );
};

const PromotionsList = () => {
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const { data, error } = useApi<RailsApiResponse<PostItem[]>>(
    '/railsapi/v1/content/promotions',
  );
  const { t } = useI18n();
  const isDataLoading = !data && !error;
  return (
    <main className="container-fluid mb-4 pt-5">
      <h1 className="mb-4">{t('promotions_page_title')}</h1>
      <Tabs activeKey={activeTab} onSelect={key => setActiveTab(key)}>
        <Tab eventKey="all" title="All" mountOnEnter unmountOnExit>
          {isDataLoading && (
            <div className="d-flex justify-content-center pt-4 pb-3">
              <Spinner animation="border" variant="black" className="mx-auto" />
            </div>
          )}
          {!!error && (
            <h2 className="mt-3 mb-5 text-center">
              {t('promotions_failed_to_load')}
            </h2>
          )}
          <div className="d-flex mt-1">
            {data?.Data.map(item => (
              <PromoItem key={item.id} item={item} />
            ))}
          </div>
        </Tab>
      </Tabs>
    </main>
  );
};

const PromotionPage = ({ slug }: { slug: string }) => {
  const { routes } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );
  const { data, error } = useApi<RailsApiResponse<JsonPage>>(
    `/railsapi/v1/content/promotion/${slug}`,
  );
  const isDataLoading = !data && !error;

  useEffect(() => {
    makeCollapsible('card', 'collapse', 'card-header');
  }, [data]);

  if (!isDataLoading && (error || !data?.Success)) {
    const promotionsListRoute = routes.find(
      route =>
        route.id === PagesName.PromotionsPage && !route.path.endsWith(':slug'),
    );
    return promotionsListRoute ? (
      <Redirect to={promotionsListRoute.path} />
    ) : (
      <PromotionsList />
    );
  }

  return (
    <main className="container-fluid px-3 pr-sm-4 pl-sm-5 py-4 pt-5">
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
  );
};

const PromotionsPage = () => {
  const { slug } = useParams<{ slug?: string }>();

  if (slug) {
    return <PromotionPage slug={slug} />;
  }
  return <PromotionsList />;
};

export default PromotionsPage;
