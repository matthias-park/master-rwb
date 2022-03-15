import React, { useEffect } from 'react';
import CasinoCategory from '../components/casino/CasinoCategory';
import CasinoUserCategory from '../components/casino/CasinoUserCategory';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import { COMPONENT_PAGES } from './index';
import { PagesName } from '../../../constants';
import { StyledCasinoPage } from '../components/styled/casinoStyles';
import Banner from '../components/Banner';
import CasinoFilters from '../components/casino/CasinoFilters';
import CasinoSearchContainer from '../components/casino/CasinoSearchContainer';
import CasinoBottomNav from '../components/casino/CasinoBottomNav';
import { useLocation, useParams } from 'react-router-dom';

const CasinoCategoryPage = () => {
  const { activeCategory } = useCasinoConfig();
  const location: any = useLocation();
  const params = useParams<{ category?: string; providers?: string }>();
  const isUserCategory =
    params.category && ['favourite', 'recent'].includes(params.category);

  useEffect(() => {
    COMPONENT_PAGES[PagesName.CasinoPage].preload();
  }, []);

  useEffect(() => {
    location.state?.scrollPosition &&
      ((activeCategory && activeCategory?.image) || isUserCategory) &&
      window.scroll(0, location.state.scrollPosition);
  }, [activeCategory]);

  return (
    <StyledCasinoPage>
      {isUserCategory && <Banner zone="welcome" />}
      {activeCategory?.image && (
        <Banner images={[{ image: activeCategory?.image }]} />
      )}
      <CasinoFilters />
      {isUserCategory ? <CasinoUserCategory /> : <CasinoCategory />}
      <CasinoSearchContainer />
      <CasinoBottomNav />
    </StyledCasinoPage>
  );
};

export default CasinoCategoryPage;
