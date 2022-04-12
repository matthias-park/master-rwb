import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useI18n } from '../../../hooks/useI18n';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { PostItem } from '../../../types/api/Posts';
import Spinner from 'react-bootstrap/Spinner';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import Link from '../../../components/Link';
import { makeCollapsible } from '../../../utils/uiUtils';
import clsx from 'clsx';
import RedirectNotFound from '../../../components/RedirectNotFound';
import { useRoutePath } from '../../../hooks';
import { PagesName } from '../../../constants';
import { filterPromotionsList } from '../../../utils';
import { Helmet } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import Main from '../pageLayout/Main';
import Banner from '../components/Banner';

const PromotionPage = ({ slug }: { slug: string }) => {
  const { data, error } = useApi<RailsApiResponse<PostItem>>(
    `/restapi/v1/content/promotion/${slug}?show_for=1`,
  );
  const { t } = useI18n();
  const history = useHistory();
  const isDataLoading = !data && !error;

  useEffect(() => {
    makeCollapsible('terms', 'terms-body', 'terms-toggle');
  }, [data]);

  const jsxRedirect = event => {
    event.preventDefault();
    if (event.target.tagName === 'A') {
      history.push(event.target.getAttribute('href'));
    } else if (event.target.closest('a')?.tagName === 'A') {
      history.push(event.target.closest('a').getAttribute('href'));
    }
  };

  if (!isDataLoading && (error || !data?.Success)) {
    return <RedirectNotFound />;
  }

  const promoTitle = data?.Data?.title;
  return (
    <>
      <Helmet
        title={clsx(promoTitle && `${promoTitle} - `, t('seo_site_name'))}
        defer={false}
        async
      >
        <meta
          property="og:title"
          content={clsx(promoTitle && `${promoTitle} - `, t('seo_site_name'))}
        />
      </Helmet>
      <Banner
        promoSlides={
          !!data ? [{ image: String(data?.Data?.bg_image?.url) }] : true
        }
      />
      {!!data && (
        <div className="promotions-inner-page__content">
          <div
            id="promo-inner-html"
            dangerouslySetInnerHTML={{ __html: data?.Data.body || '' }}
            onClick={event => jsxRedirect(event)}
          />
        </div>
      )}
    </>
  );
};

const PromoItem = ({ item }: { item: PostItem }) => {
  const { t } = useI18n();
  const promotionsPath = useRoutePath(PagesName.PromotionsPage);
  const linkTo = promotionsPath.replace(':slug', item.slug);

  return (
    <Card>
      <Card.Img variant="top" src={item.image.url}></Card.Img>
      <Card.Body>
        {item.title && <Card.Title>{item.title}</Card.Title>}
        {item.short_description && (
          <Card.Text>{item.short_description}</Card.Text>
        )}
        <Button as={Link} to={linkTo} variant="secondary">
          {item.button_text || t('promo_more_info')}
        </Button>
      </Card.Body>
    </Card>
  );
};

const PromotionsList = () => {
  const { data, error } = useApi<RailsApiResponse<PostItem[]>>(
    '/restapi/v1/content/promotions?show_for=1',
  );
  const { t } = useI18n();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const isDataLoading = !data && !error;
  // @ts-ignore
  const promotions = filterPromotionsList(data?.Data || []);

  useEffect(() => {
    if (promotions.length && !imagesLoaded) {
      const loadImage = image => {
        return new Promise((resolve, reject) => {
          const loadImg = new Image();
          loadImg.src = image.url;
          loadImg.onload = () => resolve(image.url);
          loadImg.onerror = (err: any) => reject(err);
        });
      };
      Promise.all(promotions.map(promo => loadImage(promo.image)))
        .then(() => setImagesLoaded(true))
        .catch(err => {
          Sentry.captureMessage(
            `Failed to load promotion image ${
              err?.path?.[0]?.currentSrc || ''
            }`,
            Sentry.Severity.Error,
          );
          setImagesLoaded(true);
        });
    } else if (!promotions.length) {
      setImagesLoaded(true);
    }
  }, [data?.Data]);

  return (
    <>
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {t('promotions_failed_to_load')}
        </h2>
      )}
      {isDataLoading || !imagesLoaded ? (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      ) : (
        <div className="promotions-page__cards">
          {promotions.map(item => (
            <PromoItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
};

const PromotionsPage = () => {
  const { slug } = useParams<{ slug?: string }>();

  return (
    <Main title="Offers" icon="icon-offers">
      <div
        className={clsx(
          'fade-in',
          slug ? 'promotions-inner-page' : 'promotions-page',
        )}
      >
        {slug ? <PromotionPage slug={slug} /> : <PromotionsList />}
      </div>
    </Main>
  );
};

export default PromotionsPage;
