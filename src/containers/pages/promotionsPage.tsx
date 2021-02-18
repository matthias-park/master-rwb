import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { Tab, Tabs } from 'react-bootstrap';
import useSWR from 'swr';
import Card from 'react-bootstrap/Card';
import { PostItem, Posts } from '../../types/api/Posts';
import Spinner from 'react-bootstrap/Spinner';

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

const PromotionsPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const { data, error } = useSWR<Posts>('/api/v1/posts.json');
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
            {data?.data?.map(item => (
              <PromoItem key={item.id} item={item} />
            ))}
          </div>
        </Tab>
      </Tabs>
    </main>
  );
};

export default PromotionsPage;
