import React, { useEffect } from 'react';
import CasinoGame from './CasinoGame';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import useApi from '../../../../hooks/useApi';
import { useI18n } from '../../../../hooks/useI18n';
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { Game } from '../../../../types/api/Casino';
import { StyledCasinoCategory } from '../styled/casinoStyles';
import clsx from 'clsx';
import { Config } from '../../../../constants';
import { forceCheck } from 'react-lazyload';

const CasinoCategory = () => {
  const { t, jsxT } = useI18n();
  const {
    casinoType,
    activeCategory,
    setParams,
    games,
    filteredGames,
    setGames,
  } = useCasinoConfig();
  const params = useParams<{ category?: string; providers?: string }>();
  const categoryId = activeCategory?.id;
  const { data, error } = useApi<RailsApiResponse<Game[]>>(
    categoryId
      ? `/restapi/v1/${casinoType}/categories/${categoryId}/games`
      : '',
  );
  const foundGames = filteredGames || games;
  const isDataLoading = !data && !error;

  useEffect(() => {
    setParams(params);
  }, []);

  useEffect(() => {
    forceCheck();
  }, [games, filteredGames]);

  useEffect(() => {
    if (!!data) {
      setGames(data?.Data);
    }
  }, [data, activeCategory]);

  return (
    <StyledCasinoCategory>
      <div className="title-wrp">
        {activeCategory && (
          <i
            className={clsx(
              `icon-${Config.name}-${activeCategory?.icon}`,
              'title-icon',
            )}
          />
        )}
        <h5 className="title">{activeCategory?.name}</h5>
      </div>
      {isDataLoading && (
        <div className="d-flex my-3">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      )}
      {!!data && (
        <>
          <div className="games-wrp">
            {foundGames?.map(gameData => (
              <CasinoGame key={gameData.id} gameData={gameData} />
            ))}
          </div>
        </>
      )}
      <div className="empty-list">
        {!isDataLoading && !foundGames?.length && (
          <p>{jsxT('no_games_found')}</p>
        )}
      </div>
    </StyledCasinoCategory>
  );
};

export default CasinoCategory;
