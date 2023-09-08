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
import {
  ThemeSettings,
  PagesName,
  ComponentName,
  Config,
} from '../../../constants';
import { filterPromotionsList } from '../../../utils';
import { Helmet } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { useConfig } from '../../../hooks/useConfig';
import { getApi } from '../../../utils/apiUtils';
import { useModal } from '../../../hooks/useModal';
import { postApi } from '../../../utils/apiUtils';
import { useAuth } from '../../../hooks/useAuth';
import LoadingButton from '../../../components/LoadingButton';
import CustomAlert from '../components/CustomAlert';

const ClaimButton = ({
  campaignID,
  segment,
  className,
}: {
  campaignID: number | null;
  segment: string | null;
  className?: string;
}) => {
  const { enableModal } = useModal();
  const { t } = useI18n();
  const { user } = useAuth();

  const [claimRes, setClaimRes] = useState<{
    msg: string | null;
    success: boolean;
  }>({
    msg: '',
    success: true,
  });
  const [claiming, setClaming] = useState(false);
  const claim = async data => {
    setClaming(true);
    const res = await postApi<RailsApiResponse<null>>(
      '/restapi/v1/user/claim',
      data,
    ).catch((err: RailsApiResponse<null>) => err);
    if (res.Success) {
      enableModal(ComponentName.PromoClaimModal);
    } else {
      setClaimRes({
        msg: res.Message,
        success: res.Success,
      });
    }
    setClaming(false);
  };

  if (!user.logged_in) return null;
  return (
    <>
      <CustomAlert
        show={!claimRes?.success}
        variant="danger"
        className="w-100 d-flex flex-nowrap"
      >
        {claimRes.msg}
      </CustomAlert>
      <LoadingButton
        className={clsx('text-nowrap', 'px-0', !!className && className)}
        loading={claiming}
        onClick={() => {
          claim({
            campaign_id: campaignID,
            segment: segment,
          });
        }}
      >
        {t('promo_claim_btn')}
      </LoadingButton>
    </>
  );
};

const PromoLinkEl = ({
  item,
  className,
  children,
}: {
  item: PostItem;
  className?: string;
  children: React.ReactNode;
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

const PromoItem = ({ item, variant }: { item: PostItem; variant?: string }) => {
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
        src={item.image.url || '/assets/images/promo/promo-front.png'}
      />
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

const PromoCard = ({ post }: { post: PostItem }) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const canClaim = !!post.campaign_id && !!post.segment && user.logged_in;
  return (
    <div key={post.id} className="promo-card promo-card--big">
      <PromoItem item={post} variant="sm" />
      <div className="promo-card__body">
        <h5 className="promo-card__body-title">{post.page_title}</h5>
        <h6 className="promo-card__body-subtitle">{post.title}</h6>
        <p className="promo-card__body-text">{post.short_description}</p>
        <div
          className={clsx('promo-card__body-buttons', canClaim && 'can-claim')}
        >
          {canClaim && (
            <ClaimButton campaignID={post.campaign_id} segment={post.segment} />
          )}
          <PromoLinkEl item={post} className="mt-auto promo-link">
            <Button
              variant="secondary"
              className="text-line-overflow d-inline-block"
            >
              {post.button_text || t('promotions_details')}
            </Button>
          </PromoLinkEl>
        </div>
      </div>
    </div>
  );
};

const PromotionsList = () => {
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { data, error } = useApi<RailsApiResponse<PostItem[]>>(
    ['/restapi/v1/content/promotions?show_for=1', locale],
    url => getApi(url, { cache: 'no-store' }),
  );
  const { t } = useI18n();
  const isDataLoading = !data && !error;

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
    <main className={clsx('mb-5', 'min-vh-70 w-100')}>
      <h1 className="account-settings__title">{t('promotions_page_title')}</h1>
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {t('promotions_failed_to_load')}
        </h2>
      )}
      {isDataLoading || !imagesLoaded ? (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      ) : (
        <div className={'promotions-list-inner'}>
          {!promotions.length && (
            <h2 className="my-5 w-100 text-center">
              {t('promotions_no_data')}
            </h2>
          )}
          {promotions.map(item => {
            return <PromoCard key={item.id} post={item} />;
          })}
        </div>
      )}
    </main>
  );
};

const PromotionsListBlock = ({ currentSlug }) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const { data, error } = useApi<RailsApiResponse<PostItem[]>>(
    ['/restapi/v1/content/promotions?show_for=1', locale],
    url => getApi(url, { cache: 'no-store' }),
  );
  const promotions = filterPromotionsList(data?.Data || []);

  const numberOfPromotions = promotions
    .slice(0, 4)
    .find(promo => promo.slug === currentSlug)
    ? 5
    : 4;
  const isDataLoading = !data && !error;

  return (
    <>
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3 min-vh-70">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      <div className="promo-cards">
        {promotions.slice(0, numberOfPromotions).map(item => {
          const canClaim =
            !!item.campaign_id && !!item.segment && user.logged_in;

          return (
            item.slug !== currentSlug && (
              <div key={item.id} className="promo-card">
                <PromoItem item={item} variant="sm" />
                <div className="promo-card__body">
                  <h5 className="promo-card__body-title">{item.page_title}</h5>
                  <h6 className="promo-card__body-subtitle">{item.title}</h6>
                  <p className="promo-card__body-text">
                    {item.short_description}
                  </p>
                  <div
                    className={clsx(
                      'promo-card__body-buttons',
                      canClaim && 'can-claim',
                    )}
                  >
                    {canClaim && (
                      <ClaimButton
                        campaignID={item.campaign_id}
                        segment={item.segment}
                      />
                    )}
                    <PromoLinkEl item={item} className="mt-auto promo-link">
                      <Button
                        variant="secondary"
                        className="text-line-overflow d-inline-block"
                      >
                        {item.button_text || t('promotions_details')}
                      </Button>
                    </PromoLinkEl>
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

const PromotionPage = ({ slug }: { slug: string }) => {
  const { icons: icon } = ThemeSettings!;
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const { data, error } = useApi<RailsApiResponse<PostItem>>(
    [`/restapi/v1/content/promotion/${slug}?show_for=1`, locale],
    url => getApi(url, { cache: 'no-store' }),
  );
  const { t } = useI18n();
  const history = useHistory();
  const desktopWidth = useDesktopWidth(568);
  const [promoImageLoaded, setPromoImageLoaded] = useState(false);
  const isDataLoading = !data && !error;
  const canClaim = !!data?.Data.campaign_id && !!data.Data.segment;

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

  const promoTitle = data?.Data?.title;
  return (
    <main className={clsx('pl-3 w-100', 'min-vh-70')}>
      <Helmet
        title={clsx(
          promoTitle && `${promoTitle}${Config.seoTitleSeperator}`,
          t('seo_site_name'),
        )}
        defer={false}
        async
      />
      <Link to={'/promotions'}>
        <h1 className="account-settings__title d-flex align-items-center mb-3">
          <i className={clsx('mr-2', icon?.left)}></i>
          {t('promotions_page_title')}
        </h1>
      </Link>
      {(isDataLoading || !promoImageLoaded) && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      {!!data && (
        <div
          className={clsx(
            'promotion-inner promotion-inner--block',
            !promoImageLoaded && 'd-none',
          )}
        >
          <div className="promotion-inner__banner">
            <img
              alt="banner"
              className="promotion-inner__banner-img"
              onLoad={() => setPromoImageLoaded(true)}
              onError={() => setPromoImageLoaded(true)}
              src={bannerImg || fallbackBannerImg}
            ></img>
            <div className="promo-bg-text">
              {promoTitle && (
                <h3 className="promo-bg-text__subtitle">{promoTitle}</h3>
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
            <p className="promotion-inner__body-title">
              {data?.Data?.page_title}
            </p>
            <p className="promotion-inner__body-short">
              {data?.Data.short_description}
            </p>
            <div
              id="promo-inner-html"
              dangerouslySetInnerHTML={{ __html: data?.Data.body || '' }}
              onClick={event => jsxRedirect(event)}
            />
            {canClaim && (
              <ClaimButton
                campaignID={data.Data.campaign_id}
                segment={data.Data.segment}
                className="promo-inner__claim-btn mt-3"
              />
            )}
            <div className="promotion-inner__body-divider">
              <i className="icon-rwb-responsible"></i>
              Terms and Conditions
            </div>
            <ul className="promotion-inner__body-list">
              <li>{t('terms_and_condition_list1')}</li>
              <li>{t('terms_and_condition_list2')}</li>
              <li>{t('terms_and_condition_list3')}</li>
            </ul>
            <p className="promotion-inner__body-caution">
              {t('terms_and_condition_list-caution')}
            </p>
          </div>
          <PromotionsListBlock currentSlug={data?.Data.slug} />
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
