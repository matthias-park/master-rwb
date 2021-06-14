import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useI18n } from '../../../hooks/useI18n';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import Button from 'react-bootstrap/Button';
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

const PromoLinkEl = ({
  item,
  className,
  children,
}: {
  item: PostItem;
  className?: string;
  children: JSX.Element | JSX.Element[];
}) => {
  const promotionsPath = useRoutePath(PagesName.PromotionsPage);
  const linkTo = promotionsPath.replace(':slug', item.slug);

  return (
    <>
      {item.slug ? (
        <Link className={className} to={linkTo}>
          {children}
        </Link>
      ) : (
        children
      )}
    </>
  );
};

const PromoItem = ({
  item,
  variant,
  imageLoaded,
}: {
  item: PostItem;
  variant?: string;
  imageLoaded?: () => void;
}) => {
  return (
    <PromoLinkEl
      item={item}
      className={clsx(
        'promotion-block',
        variant && `promotion-block--${variant}`,
      )}
    >
      <img
        alt="promo"
        className="promotion-block__img"
        onLoad={imageLoaded}
        onError={imageLoaded}
        src={item.image.url || '/assets/images/promo/promo-front.png'}
      ></img>
      <div className="promotion-block__body">
        {item.title && (
          <h3 className="promotion-block__body-subtitle">{item.title}</h3>
        )}
        <h2 className="promotion-block__body-title">{item.page_title}</h2>
        {item.button_text && (
          <button className="promo-button promotion-block__body-button">
            {item.button_text}
          </button>
        )}
      </div>
    </PromoLinkEl>
  );
};

const PromotionsList = () => {
  const { data, error } = useApi<RailsApiResponse<PostItem[]>>(
    '/railsapi/v1/content/promotions',
  );
  const { t } = useI18n();
  const [imagesLoaded, setImagesLoaded] = useState({});
  const isDataLoading = !data && !error;

  const setImageLoaded = (id: number) =>
    setImagesLoaded(prev => ({ ...prev, [id]: true }));

  useEffect(() => {
    if (data?.Data) {
      setImagesLoaded(
        data?.Data.reduce((obj, cur) => ({ ...obj, [cur.id]: false }), {}),
      );
    }
  }, [data?.Data]);

  const allImagesLoaded = !Object.values(imagesLoaded).some(loaded => !loaded);
  return (
    <main className="mb-5 pt-0 pt-xl-5 min-vh-70">
      {(isDataLoading || !allImagesLoaded) && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {t('promotions_failed_to_load')}
        </h2>
      )}
      <div
        className={clsx('promotions-list mt-4', !allImagesLoaded && 'd-none')}
      >
        {data?.Data.map(item => (
          <PromoItem
            key={item.id}
            item={item}
            imageLoaded={() => setImageLoaded(item.id)}
          />
        ))}
      </div>
    </main>
  );
};

const PromotionsListBlock = ({ currentSlug }) => {
  const { t } = useI18n();
  const { data, error } = useApi<RailsApiResponse<PostItem[]>>(
    '/railsapi/v1/content/promotions',
  );
  const numberOfPromotions = data?.Data.slice(0, 4).find(
    promo => promo.slug === currentSlug,
  )
    ? 5
    : 4;
  const isDataLoading = !data && !error;

  return (
    <>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3 min-vh-70">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      <div className="promo-cards">
        {data?.Data?.slice(0, numberOfPromotions).map(
          item =>
            item.slug !== currentSlug && (
              <div key={item.id} className="promo-card">
                <PromoItem item={item} variant="sm" />
                <div className="promo-card__body">
                  <h5 className="promo-card__body-title">{item.page_title}</h5>
                  <h6 className="promo-card__body-subtitle">{item.title}</h6>
                  <p className="promo-card__body-text">
                    {item.short_description}
                  </p>
                  <PromoLinkEl item={item} className="mt-auto">
                    <Button
                      variant="primary"
                      className="text-line-overflow d-inline-block"
                    >
                      {item.button_text || t('promotions_details')}
                    </Button>
                  </PromoLinkEl>
                </div>
              </div>
            ),
        )}
      </div>
    </>
  );
};

const PromotionPage = ({ slug }: { slug: string }) => {
  const { data, error } = useApi<RailsApiResponse<PostItem>>(
    `/railsapi/v1/content/promotion/${slug}`,
  );
  const history = useHistory();
  const desktopWidth = useDesktopWidth(568);
  const [promoImageLoaded, setPromoImageLoaded] = useState(false);
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

  const bannerImg = desktopWidth
    ? data?.Data?.bg_image?.url
    : data?.Data?.bg_image_mobile?.url;
  const fallbackBannerImg = desktopWidth
    ? '/assets/images/promo/promo-inner-lg.png'
    : '/assets/images/promo/promo-inner-sm.png';

  return (
    <main className="pt-xl-5 min-vh-70">
      {(isDataLoading || !promoImageLoaded) && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!data && (
        <div className={clsx('promotion-inner', !promoImageLoaded && 'd-none')}>
          <div className="promotion-inner__banner">
            <img
              alt="banner"
              className="promotion-inner__banner-img"
              onLoad={() => setPromoImageLoaded(true)}
              onError={() => setPromoImageLoaded(true)}
              src={bannerImg || fallbackBannerImg}
            ></img>
            <div className="promo-bg-text">
              {data?.Data.title && (
                <h3 className="promo-bg-text__subtitle">{data?.Data?.title}</h3>
              )}
              <h2 className="promo-bg-text__title">{data?.Data?.page_title}</h2>
              {data?.Data.button_text && data?.Data.inner_page_button_link && (
                <Link
                  to={data?.Data?.inner_page_button_link}
                  className="promo-button promo-bg-text__button d-inline-block"
                >
                  {data?.Data.button_text}
                </Link>
              )}
            </div>
          </div>
          <div className="promotion-inner__body promo-container">
            <p className="promotion-inner__body-short">
              {data?.Data.short_description}
            </p>
            <div
              id="promo-inner-html"
              dangerouslySetInnerHTML={{ __html: data?.Data.body || '' }}
              onClick={event => jsxRedirect(event)}
            />
            <PromotionsListBlock currentSlug={data?.Data.slug} />
          </div>
        </div>
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
