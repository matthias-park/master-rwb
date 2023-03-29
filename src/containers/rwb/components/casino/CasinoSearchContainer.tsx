import React from 'react';
import CasinoSearch from './CasinoSearch';
import CasinoGame from './CasinoGame';
import { StyledCasinoSearchContainer } from '../styled/casinoStyles';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useI18n } from '../../../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';

const CasinoSearchContainer = () => {
  const { t } = useI18n();
  const { searchData } = useCasinoConfig();
  const games = searchData.searchValue ? searchData.games : [];

  if (!searchData.showSearch) return null;
  return (
    <StyledCasinoSearchContainer>
      <div className="search-container-wrp">
        <CasinoSearch />
        <div className="games-list-wrp">
          {searchData.searchValue && !searchData.loading && (
            <h5 className="title">
              {t('casino_search_results')} <q>{searchData.searchValue}</q>{' '}
              {`(${searchData.games?.length})`}
            </h5>
          )}
          {searchData.loading && (
            <div className="d-flex justify-content-center pt-4 pb-3">
              <Spinner animation="border" variant="white" className="mx-auto" />
            </div>
          )}
          {games?.length && !searchData.loading ? (
            <div className="games-list">
              {!searchData.loading &&
                games?.map(game => (
                  <CasinoGame key={game.id} gameData={game} />
                ))}
            </div>
          ) : (
            !searchData.loading && <h5>{t('casino_games_no_data')}</h5>
          )}
        </div>
      </div>
    </StyledCasinoSearchContainer>
  );
};

export default CasinoSearchContainer;
