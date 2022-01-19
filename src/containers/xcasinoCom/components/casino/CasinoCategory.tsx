import React, { useEffect } from 'react';
import CasinoGame from './CasinoGame';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import useApi from '../../../../hooks/useApi';
import { useI18n } from '../../../../hooks/useI18n';
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { Game } from '../../../../types/api/Casino';
import CasinoGroupSlider from './CasinoGroupSlider';

const CasinoCategory = () => {
  const { t } = useI18n();
  const {
    activeCategory,
    activeProvider,
    setParams,
    games,
    filteredGames,
    setGames,
    categoryFilter,
    providerFilter,
    casinoType,
  } = useCasinoConfig();
  const params = useParams<{ category?: string; providers?: string }>();
  const categoryId = categoryFilter?.id || activeCategory?.id;
  const providerId = providerFilter?.id || activeProvider?.id;
  const { data, error } = useApi<RailsApiResponse<Game[]>>(
    categoryId || providerId
      ? `/restapi/v1/casino/${
          params?.category
            ? `${casinoType === 'live-casino' ? 'live_' : ''}categories`
            : 'custom_providers'
        }/${params?.category ? categoryId : providerId}/games`
      : '',
  );
  const isDataLoading = !data && !error;
  const foundGames = filteredGames || games;
  const featuredGames = foundGames?.filter(game =>
    game.features?.includes('front_page'),
  );
  const categoryGames = foundGames?.filter(
    game => !featuredGames?.some(featuredGame => featuredGame.id === game.id),
  );

  useEffect(() => {
    setParams(params);
  }, []);

  useEffect(() => {
    if (!!data) {
      setGames(data?.Data);
    }
  }, [data, activeProvider, activeCategory]);

  return (
    <>
      {isDataLoading && (
        <div className="d-flex my-3">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      )}
      {!isDataLoading && !foundGames?.length && (
        <h4 className="mt-2">{t('no_games_found')}</h4>
      )}
      {!!data && (
        <>
          <CasinoGroupSlider
            games={featuredGames}
            rightSpacing
            featured
            className="expand-right"
          />
          <div className="casino-category-wrp">
            {!!data &&
              categoryGames?.map(gameData => (
                <CasinoGame gameData={gameData} />
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default CasinoCategory;
