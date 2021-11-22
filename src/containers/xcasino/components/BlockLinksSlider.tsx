import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import clsx from 'clsx';
import Link from '../../../components/Link';

interface BlockLinksSliderProps {
  items: {
    link: string;
    img?: string | null;
  }[];
  className?: string;
  cardClassName?: string;
  title?: string;
}

const BlockLinksSlider = ({
  items,
  className,
  cardClassName,
  title,
}: BlockLinksSliderProps) => {
  return (
    <div className={clsx('block-links-slider', className)}>
      {title && <h5 className="mb-3">{title}</h5>}
      <Swiper
        spaceBetween={5}
        slidesPerView={2.3}
        slidesPerGroup={1}
        grabCursor
        effect="slide"
        breakpoints={{
          '1920.98': {
            slidesPerView: 9,
          },
          '1600.98': {
            slidesPerView: 7.8,
          },
          '1366.98': {
            slidesPerView: 6.8,
          },
          '1200.98': {
            slidesPerView: 5.8,
          },
          '768.98': {
            slidesPerView: 4.8,
          },
          '414.98': {
            slidesPerView: 3.2,
          },
        }}
      >
        {items.map(item => {
          return (
            <SwiperSlide>
              <Link
                to={item.link}
                className={clsx('block-links-slider__card', cardClassName)}
              >
                {item.img && (
                  <img
                    src={item.img}
                    className="block-links-slider__card-img"
                  />
                )}
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BlockLinksSlider;
