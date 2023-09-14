import React, { useMemo, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import CasinoGame from './CasinoGame';
import clsx from 'clsx';
import useApi from '../../../../hooks/useApi';
import { useI18n } from '../../../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';
import { Game } from '../../../../types/api/Casino';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { StyledGroupSlider } from '../styled/casinoStyles';
import { ThemeSettings } from '../../../../constants';
import { Link } from 'react-router-dom';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import SwiperCore, { Navigation } from 'swiper';
import { forceCheck } from 'react-lazyload';
import 'swiper/swiper.scss';
SwiperCore.use([Navigation]);

interface CasinoGroupSliderProps {
  id: number;
  name?: string;
  category?: {
    id: number;
    slug: string;
    icon: string;
    quantity: number | undefined;
  };
  className?: string;
  games?: Game[];
}

export const CasinoGroupSlider = ({
  id,
  name,
  category,
  className,
  games,
}: CasinoGroupSliderProps) => {
  const { icons: icon } = ThemeSettings!;
  const { t } = useI18n();
  const { casinoType } = useCasinoConfig();
  const { data, error } = useApi<RailsApiResponse<Game[]>>(
    !games && category
      ? `/restapi/v1/casino/categories/${category.id}/games`
      : '',
  );
  const isDataLoading = !data && !games && !error;
  const currentGames = data?.Data || games;
  const frontPageQuantity = category?.quantity || 5;
  const gamesInGroups = useMemo(() => {
    let groupedGames: Game[][] = [];

    if (currentGames) {
      const featuredGames = currentGames?.filter(game =>
        game?.features?.includes('big_image'),
      );
      const gamesWithoutFeatured = currentGames?.filter(
        game => !game?.features?.includes('big_image'),
      );
      for (let i = 0; i <= currentGames.length; i = i + frontPageQuantity) {
        if (featuredGames[i / frontPageQuantity])
          groupedGames = [
            ...groupedGames,
            [featuredGames[i / frontPageQuantity]],
          ];
        if (gamesWithoutFeatured.length >= 1)
          groupedGames = [
            ...groupedGames,
            gamesWithoutFeatured.slice(i, i + frontPageQuantity),
          ];
      }
    }
    return groupedGames;
  }, [currentGames]);

  useEffect(() => {
    forceCheck();
  }, [currentGames]);

  return (
    <StyledGroupSlider className="styled-group-slider">
      {name && (
        <div className="title-wrp">
          <i className={clsx(`icon-${category?.icon}`, 'title-icon')} />
          <h5 className="title">{name}</h5>
          <div className="navigation">
            <i className={clsx(icon?.left, `swiper-button-prev-${id}`)} />
            <i className={clsx(icon?.right, `swiper-button-next-${id}`)} />
          </div>
          <Link
            to={`/${casinoType}/${category?.slug}`}
            className="all-games-link"
          >
            {t('casino_see_all')}
          </Link>
        </div>
      )}
      {isDataLoading && (
        <div className="d-flex py-5 mb-3">
          <Spinner animation="border" variant="white" />
        </div>
      )}
      {currentGames && (
        <div className="wrp">
          <Swiper
            key={`${id}-${name}`}
            slidesOffsetAfter={0}
            spaceBetween={8}
            slidesPerView={1}
            slidesPerGroup={1}
            grabCursor
            effect="slide"
            lazy={true}
            navigation={{
              nextEl: `.swiper-button-next-${id}`,
              prevEl: `.swiper-button-prev-${id}`,
              disabledClass: 'disabled',
            }}
            breakpoints={{
              '1920.98': {
                slidesPerView: 1,
              },
              '1600.98': {
                slidesPerView: 1,
              },
              '1366.98': {
                slidesPerView: 1,
              },
              '1200.98': {
                slidesPerView: 1,
              },
              '768.98': {
                slidesPerView: 1,
              },
            }}
          >
            {gamesInGroups.map((gamesGroup, index) => (
              <div key={`casino-group-${index}`}>
                {gamesGroup.length === 1 &&
                gamesGroup[0].features?.includes('big_image') ? (
                  <SwiperSlide key={gamesGroup[0]?.id}>
                    <CasinoGame
                      key={gamesGroup[0].id}
                      gameData={gamesGroup[0]}
                      featured
                    />
                  </SwiperSlide>
                ) : (
                  <SwiperSlide key={gamesGroup[0]?.id}>
                    <div className="games-group">
                      {gamesGroup.map(gameData => (
                        <CasinoGame key={gameData.id} gameData={gameData} />
                      ))}
                    </div>
                  </SwiperSlide>
                )}
              </div>
            ))}
          </Swiper>
        </div>
      )}
    </StyledGroupSlider>
  );
};

export default CasinoGroupSlider;
