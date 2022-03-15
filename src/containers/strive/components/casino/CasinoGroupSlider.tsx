import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import CasinoGame from './CasinoGame';
import clsx from 'clsx';
import useApi from '../../../../hooks/useApi';
import { useI18n } from '../../../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';
import { Game } from '../../../../types/api/Casino';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { StyledGroupSlider } from '../styled/casinoStyles';
import { Config } from '../../../../constants';
import { Link } from 'react-router-dom';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import SwiperCore, { Navigation } from 'swiper';
SwiperCore.use([Navigation]);

interface CasinoGroupSliderProps {
  id: number;
  name?: string;
  category?: { id: number; slug: string; icon: string };
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
  const { t } = useI18n();
  const { casinoType } = useCasinoConfig();
  const { data, error } = useApi<RailsApiResponse<Game[]>>(
    !games && category
      ? `/restapi/v1/casino/categories/${category.id}/games`
      : '',
  );
  const isDataLoading = !data && !games && !error;
  const currentGames = data?.Data || games;
  const gamesInGroups = useMemo(() => {
    let groupedGames: Game[][] = [];
    if (currentGames) {
      const featuredGames = currentGames?.filter(game =>
        game?.features?.includes('big_image'),
      );
      const gamesWithoutFeatured = currentGames?.filter(
        game => !game?.features?.includes('big_image'),
      );
      for (let i = 0; i <= currentGames.length; i = i + 4) {
        if (featuredGames[i / 4])
          groupedGames = [...groupedGames, [featuredGames[i / 4]]];
        groupedGames = [...groupedGames, gamesWithoutFeatured.slice(i, i + 4)];
      }
    }
    return groupedGames;
  }, [currentGames]);

  return (
    <>
      {isDataLoading && (
        <div className="d-flex my-5">
          <Spinner animation="border" variant="white" />
        </div>
      )}
      {currentGames && (
        <StyledGroupSlider>
          {name && (
            <div className="title-wrp">
              <i
                className={clsx(
                  `icon-${Config.name}-${category?.icon}`,
                  'title-icon',
                )}
              />
              <h5 className="title">{name}</h5>
              <div className="navigation">
                <i
                  className={clsx(
                    `icon-${Config.name}-left`,
                    `swiper-button-prev-${id}`,
                  )}
                />
                <i
                  className={clsx(
                    `icon-${Config.name}-right`,
                    `swiper-button-next-${id}`,
                  )}
                />
              </div>
              <Link
                to={`/${casinoType}/${category?.slug}`}
                className="all-games-link"
              >
                {t('casino_see_all')}
              </Link>
            </div>
          )}
          <div className="wrp">
            <Swiper
              key={`${id}-${name}`}
              slidesOffsetAfter={0}
              spaceBetween={16}
              slidesPerView={2}
              slidesPerGroup={2}
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
                  slidesPerView: 7,
                },
                '1600.98': {
                  slidesPerView: 6,
                },
                '1366.98': {
                  slidesPerView: 5,
                },
                '1200.98': {
                  slidesPerView: 5,
                },
                '768.98': {
                  slidesPerView: 3,
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
        </StyledGroupSlider>
      )}
    </>
  );
};

export default CasinoGroupSlider;
