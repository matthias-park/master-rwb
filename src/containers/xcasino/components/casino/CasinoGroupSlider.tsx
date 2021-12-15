import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import CasinoGame from './CasinoGame';
import clsx from 'clsx';
import useApi from '../../../../hooks/useApi';
import Spinner from 'react-bootstrap/Spinner';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useConfig } from '../../../../hooks/useConfig';
import { Game } from '../../../../types/api/Casino';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';

interface CasinoGroupSliderProps {
  name?: string;
  category?: { id: number; slug: string };
  className?: string;
  featured?: boolean;
  rows?: number;
  noTitle?: boolean;
  gap?: number;
  games?: Game[];
  rightSpacing?: boolean;
}

export const CasinoGroupSlider = ({
  name,
  category,
  className,
  featured,
  noTitle,
  gap,
  games,
  rightSpacing,
}: CasinoGroupSliderProps) => {
  const { casinoType } = useCasinoConfig();
  const desktopWidth = useDesktopWidth(500);
  const { featuredCasinoCategories } = useConfig();
  const { data, error } = useApi<RailsApiResponse<Game[]>>(
    !games && category
      ? `/restapi/v1/casino/${
          casinoType === 'live-casino' ? 'live_' : ''
        }categories/${category.id}/games`
      : '',
  );
  const isDataLoading = !data && !games && !error;
  const currentGames = data?.Data || games;
  const isFeaturedCategory = featuredCasinoCategories?.some(
    featuredCategory => featuredCategory === category?.slug,
  );
  const gamesWithoutFeatured = currentGames?.filter(
    game => !game.features?.includes('front_page'),
  );
  const featuredGames = currentGames?.filter(game =>
    game.features?.includes('front_page'),
  );

  return (
    <div
      className={clsx(
        'casino-group-slider',
        className === 'expand-right' && rightSpacing
          ? desktopWidth
            ? ''
            : className
          : className,
        isDataLoading && 'pt-0',
      )}
    >
      {isDataLoading && (
        <div className="d-flex my-7">
          <Spinner animation="border" variant="white" />
        </div>
      )}
      {currentGames && (
        <>
          {!noTitle && name && (
            <h5 className="casino-group-slider__title">{name}</h5>
          )}
          <div className="casino-group-slider__wrp">
            <Swiper
              slidesOffsetAfter={20}
              spaceBetween={gap || 10}
              slidesPerView={2.264}
              slidesPerGroup={2}
              grabCursor
              effect="slide"
              lazy={true}
              breakpoints={{
                '1920.98': {
                  slidesPerView: 8,
                },
                '1600.98': {
                  slidesPerView: rightSpacing ? 7 : 7.264,
                },
                '1366.98': {
                  slidesPerView: rightSpacing ? 6 : 6.264,
                },
                '1200.98': {
                  slidesPerView: rightSpacing ? 5 : 5.264,
                },
                '768.98': {
                  slidesPerView: rightSpacing ? 4 : 4.264,
                },
                '500': {
                  slidesPerView: rightSpacing ? 3 : 3.264,
                },
              }}
            >
              {(featured || isFeaturedCategory
                ? featuredGames
                : gamesWithoutFeatured
              )
                ?.slice(0, 12)
                .map(gameData => (
                  <SwiperSlide key={gameData.id}>
                    <CasinoGame gameData={gameData} />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </>
      )}
    </div>
  );
};

export default CasinoGroupSlider;
