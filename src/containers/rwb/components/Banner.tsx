import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { useConfig } from '../../../hooks/useConfig';
import { FullBanner } from './styled/Banner';
import useApi from '../../../hooks/useApi';
import Link from '../../../components/Link';
import clsx from 'clsx';
import { ThemeSettings } from '../../../constants';
import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';
import { isMobile } from 'react-device-detect';
SwiperCore.use([Pagination, Navigation, Autoplay]);

interface BannerProps {
  zone?: string;
  images?: { image: string }[] | null;
}

const Banner = ({ zone, images }: BannerProps) => {
  const { locale } = useConfig();
  const { data, error } = useApi<RailsApiResponse<any>>(
    zone
      ? `/restapi/v1/content/banners/${zone}/${locale}`
      : `/restapi/v1/content/banners/welcome/${locale}`,
  );
  const isDataLoading = !data && !error && !images;
  //@ts-ignore
  const { icons: icon } = ThemeSettings!;

  return (
    <FullBanner className="fade-in">
      {isDataLoading ? (
        <div className="m-auto">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      ) : images?.length === 1 ? (
        <img alt="" src={images[0].image} />
      ) : (
        <>
          <Swiper
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            loop
            grabCursor
            effect="slide"
            pagination={
              !isMobile && {
                clickable: true,
                renderBullet: function (index, className) {
                  return `<span class=${className}></span>`;
                },
              }
            }
            navigation={
              !isMobile && {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                disabledClass: 'disabled',
              }
            }
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
          >
            {(data?.Data || images)?.map((banner, i) => (
              <SwiperSlide key={`${banner.image}_${i}`}>
                <Link to={banner?.link || '#'}>
                  <img alt="" key={`${banner.image}_${i}`} src={banner.image} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          {!isMobile && (
            <div className="swiper-navigation">
              <i className={clsx(icon?.left, 'swiper-button-prev')} />
              <i className={clsx(icon?.right, 'swiper-button-next')} />
            </div>
          )}
        </>
      )}
    </FullBanner>
  );
};

export default Banner;
