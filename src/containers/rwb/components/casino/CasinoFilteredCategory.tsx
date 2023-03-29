import React, { useEffect, useMemo } from 'react';
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

const CasinoFilteredCategory = ({
  filter,
  title,
  icon,
}: {
  filter: (game: Game) => boolean | undefined;
  title: string;
  icon: string;
}) => {
  const { jsxT } = useI18n();
  const {
    casinoType,
    setParams,
    setGames,
    categories,
    games,
    filteredGames,
    filters,
  } = useCasinoConfig();
  const params = useParams<{ category?: string; providers?: string }>();
  const allCategory = useMemo(
    () => categories?.find(category => category.slug === 'all'),
    [categories],
  );
  const categoryId = allCategory?.id;
  const { data, error } = useApi<RailsApiResponse<Game[]>>(
    categoryId
      ? `/restapi/v1/${casinoType}/categories/${categoryId}/games`
      : '',
  );
  const currentGames = useMemo(() => {
    return filter ? data?.Data.filter(filter) : [];
  }, [data]);
  const foundGames = filteredGames || games;
  const isDataLoading = (!data && !error) || filters.loading;

  useEffect(() => {
    setParams(params);
  }, []);

  useEffect(() => {
    if (!!data && currentGames) {
      setGames(currentGames);
    }
  }, [data]);

  return (
    <StyledCasinoCategory>
      <div className="title-wrp">
        {title && icon && (
          <i className={clsx(`icon-${Config.name}-${icon}`, 'title-icon')} />
        )}
        <h5 className="title">{title}</h5>
      </div>
      {isDataLoading && (
        <div className="d-flex my-3">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      )}
      {!!data && !filters.loading && (
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

export default CasinoFilteredCategory;
