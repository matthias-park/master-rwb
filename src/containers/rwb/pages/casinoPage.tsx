import React, { useEffect } from 'react';
import CasinoLobby from '../components/casino/CasinoLobby';
import CasinoFilters from '../components/casino/CasinoFilters';
import { COMPONENT_PAGES } from './index';
import { PagesName } from '../../../constants';
import { StyledCasinoPage } from '../components/styled/casinoStyles';
import Banner from '../components/Banner';
import CasinoSearchContainer from '../components/casino/CasinoSearchContainer';
import CasinoBottomNav from '../components/casino/CasinoBottomNav';
import { useLocation } from 'react-router-dom';

const CasinoPage = () => {
  const location: any = useLocation();

  useEffect(() => {
    COMPONENT_PAGES[PagesName.CasinoCategoryPage].preload();
    location.state?.scrollPosition &&
      window.scroll(0, location.state.scrollPosition);
  }, []);

  return (
    <StyledCasinoPage className="styled-casino-page">
      <Banner zone={'welcome'} />
      <CasinoFilters />
      <CasinoLobby />
      <CasinoSearchContainer />
      <CasinoBottomNav />
    </StyledCasinoPage>
  );
};

export default CasinoPage;
