import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { getApi } from '../../../utils/apiUtils';
import { useAuth } from '../../../hooks/useAuth';
import { ComponentName } from '../../../constants';
import { useModal } from '../../../hooks/useModal';
import { useHistory } from 'react-router-dom';
import { useConfig } from '../../../hooks/useConfig';

interface SlideItem {
  id?: number;
  banner_visible?: boolean | null;
  banner_details_visible?: boolean | null;
  valid_from?: string | null;
  valid_till?: string | null;
  order_num?: number | null;
  background_color?: string | null;
  button_text?: string | null;
  button_color?: string | null;
  image?: string | undefined;
  title?: string | null;
  message?: string | null;
  display_mode?: number;
}

interface BannerProps {
  promoSlides?: SlideItem[] | true;
  zone?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const Banner = ({ promoSlides, onLoad, onError, zone }: BannerProps) => {
  const [slides, setSlides] = useState<SlideItem[]>([{ image: undefined }]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { enableModal } = useModal();
  const history = useHistory();
  const { locale } = useConfig();
  const { user } = useAuth();

  const loginStatusFilter = (slide: SlideItem): boolean => {
    return (
      (user.logged_in && slide.display_mode === 1) ||
      (!user.logged_in && slide.display_mode === 2) ||
      slide.display_mode === 0
    );
  };

  const hasContent = slide => {
    return Object.keys(slide).length > 1;
  };

  useEffect(() => {
    if (!!promoSlides) {
      if (typeof promoSlides === typeof slides) {
        setIsDataLoading(false);
        setSlides(promoSlides as SlideItem[]);
      }
    } else {
      (async () => {
        const data = await getApi<RailsApiResponse<any>>(
          `/restapi/v1/content/banners/${zone}/${locale}`,
        );
        setIsDataLoading(false);
        setSlides(data.Data);
      })();
    }
  }, [promoSlides, user]);

  return (
    <div className="main-banner banner fixed-aspect">
      {isDataLoading ? (
        <div className="d-flex h-100 py-5">
          <Spinner animation="border" variant="white" className="m-auto" />
        </div>
      ) : slides?.length === 1 ? (
        <div className="banner__item fade-in fixed-aspect">
          <img
            src={slides[0].image}
            className="banner__item-img fixed-aspect"
            alt=""
          ></img>
          <div className={clsx(hasContent(slides[0]) && 'banner__item-text')}>
            <h3 className="banner__item-text-sub">{slides[0].message}</h3>
            <h1 className="banner__item-text-main">{slides[0].title}</h1>
            {!!slides[0].button_text && loginStatusFilter(slides[0]) && (
              <Button
                onClick={() =>
                  user.logged_in
                    ? history.push('/account/wallet/deposit')
                    : enableModal(ComponentName.RegisterModal)
                }
                className="banner__item-text-btn"
                size="lg"
                style={
                  slides[0].button_color
                    ? {
                        backgroundColor: slides[0].button_color,
                      }
                    : undefined
                }
              >
                {slides[0].button_text}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          slidesPerGroup={1}
          loop
          grabCursor
          effect="slide"
          className="fixed-aspect"
        >
          {slides?.map(slide => {
            return loginStatusFilter(slide) ? (
              <SwiperSlide>
                <div className="banner__item fade-in fixed-aspect">
                  <img
                    src={slide.image}
                    className="banner__item-img fixed-aspect"
                    alt=""
                  ></img>
                  {hasContent(slide) && (
                    <div className="banner__item-text">
                      <h3 className="banner__item-text-sub">{slide.message}</h3>
                      <h1 className="banner__item-text-main">{slide.title}</h1>
                      {!!slide.button_text && (
                        <Button
                          onClick={() =>
                            user.logged_in
                              ? history.push('/account/wallet/deposit')
                              : enableModal(ComponentName.RegisterModal)
                          }
                          className="banner__item-text-btn"
                          size="lg"
                          style={
                            !!slide.background_color
                              ? {
                                  backgroundColor: slide.background_color,
                                }
                              : undefined
                          }
                        >
                          {slide.button_text}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ) : (
              <></>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Banner;
