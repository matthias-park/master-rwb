import React, { useEffect, useState } from 'react';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useI18n } from '../../../../hooks/useI18n';
import CasinoGame from './CasinoGame';
import { Game } from '../../../../types/api/Casino';
import Spinner from 'react-bootstrap/Spinner';

const CasinoSearchResults = () => {
  const { t } = useI18n();
  const { searchData } = useCasinoConfig();
  const [foundGames, setFoundGames] = useState<Game[] | undefined>([]);

  useEffect(() => {
    const featuredGames = searchData.games?.filter(game =>
      game.features?.includes('front_page'),
    );
    const gamesWithoutFeatured = searchData.games?.filter(
      game => !featuredGames?.some(featuredGame => featuredGame.id === game.id),
    );
    setFoundGames(gamesWithoutFeatured);
  }, [searchData.games]);

  return (
    <div className="casino-search page-content fade-in">
      <h4 className="casino-search__title">
        {t('casino_search_results')} <q>{searchData.searchValue}</q>
      </h4>
      {searchData.loading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      <div className="casino-category-wrp">
        {foundGames?.length
          ? !searchData.loading &&
            foundGames?.map(game => <CasinoGame gameData={game} />)
          : !searchData.loading && <h5>{t('casino_games_no_data')}</h5>}
      </div>
    </div>
  );
};

export default CasinoSearchResults;
