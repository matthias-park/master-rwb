import React, { useEffect } from 'react';
import CasinoGame from './CasinoGame';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useI18n } from '../../../../hooks/useI18n';
import { useParams } from 'react-router-dom';
import { StyledCasinoCategory } from '../styled/casinoStyles';
import clsx from 'clsx';
import { Config } from '../../../../constants';

const CasinoUserCategory = () => {
  const { t, jsxT } = useI18n();
  const {
    setParams,
    games,
    filteredGames,
    setGames,
    favouriteGames,
    recentGames,
  } = useCasinoConfig();
  const params = useParams<{ category?: string; providers?: string }>();
  const foundGames = filteredGames || games;
  const isFavouriteCategory = params.category === 'favourite';
  const isRecentCategory = params.category === 'recent';

  useEffect(() => {
    setParams(params);
  }, []);

  useEffect(() => {
    isFavouriteCategory && setGames(favouriteGames);
    isRecentCategory && setGames(recentGames);
  }, [favouriteGames.length, recentGames.length]);

  return (
    <StyledCasinoCategory>
      <div className="title-wrp">
        {isFavouriteCategory && (
          <>
            <i
              className={clsx(
                `icon-${Config.name}-favourite-off`,
                'title-icon',
              )}
            />
            <h5 className="title">{t('favourite_games_title')}</h5>
          </>
        )}
        {isRecentCategory && (
          <>
            <i className={clsx(`icon-${Config.name}-recent`, 'title-icon')} />
            <h5 className="title">{t('recent_games_title')}</h5>
          </>
        )}
      </div>
      <div className="games-wrp">
        {foundGames?.map(gameData => (
          <CasinoGame key={gameData.id} gameData={gameData} />
        ))}
      </div>
      <div className="empty-list">
        {!foundGames?.length && (
          <p>
            {isFavouriteCategory
              ? jsxT('no_games_found_favourite')
              : jsxT('no_games_found_recent')}
          </p>
        )}
      </div>
    </StyledCasinoCategory>
  );
};

export default CasinoUserCategory;
