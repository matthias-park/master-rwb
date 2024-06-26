import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { useConfig } from '../../../hooks/useConfig';
import { FullBanner } from './styled/Banner';
import useApi from '../../../hooks/useApi';
import Link from '../../../components/Link';
import 'swiper/swiper.scss';

interface BannerProps {
  zone?: string;
  images?: { image: string }[];
}

const Banner = ({ zone, images }: BannerProps) => {
  const { locale } = useConfig();
  const { data, error } = useApi<RailsApiResponse<any>>(
    zone ? `/restapi/v1/content/banners/${zone}/${locale}` : null,
  );
  const isDataLoading = !data && !error && !images;

  return (
    <FullBanner className="fade-in">
      {isDataLoading ? (
        <div className="m-auto">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      ) : images?.length === 1 ? (
        <img alt="" src={images[0].image} />
      ) : (
        <Swiper
          spaceBetween={15}
          slidesPerView={1}
          slidesPerGroup={1}
          loop
          grabCursor
          effect="slide"
        >
          {(data?.Data || images)?.map((banner, i) => (
            <SwiperSlide>
              <Link to={banner?.link || '#'}>
                <img alt="" key={`${banner.image}_${i}`} src={banner.image} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </FullBanner>
  );
};

export default Banner;
