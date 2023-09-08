import React, { useEffect, useMemo } from 'react';
import CasinoCategory from '../components/casino/CasinoCategory';
import CasinoUserCategory from '../components/casino/CasinoUserCategory';
import CasinoFilteredCategory from '../components/casino/CasinoFilteredCategory';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import { useConfig } from '../../../hooks/useConfig';
import { COMPONENT_PAGES } from './index';
import { PagesName, ThemeSettings } from '../../../constants';
import { StyledCasinoPage } from '../components/styled/casinoStyles';
import Banner from '../components/Banner';
import CasinoFilters from '../components/casino/CasinoFilters';
import CasinoSearchContainer from '../components/casino/CasinoSearchContainer';
import CasinoBottomNav from '../components/casino/CasinoBottomNav';
import { useLocation, useParams } from 'react-router-dom';
import { useI18n } from '../../../hooks/useI18n';

const CasinoCategoryPage = () => {
  const { icons: icon } = ThemeSettings!;
  const { t } = useI18n();
  const { activeCategory } = useCasinoConfig();
  const { hardcodedCategoriesBanners } = useConfig();
  const location: any = useLocation();
  const params = useParams<{ category?: string; providers?: string }>();
  const hardcodedBanner = useMemo(
    () =>
      hardcodedCategoriesBanners?.find(
        category => category.slug === params.category,
      ),
    [hardcodedCategoriesBanners],
  );
  const isHardcodedCategory =
    params.category &&
    ['favourite', 'recent', 'new', 'featured'].includes(params.category);

  useEffect(() => {
    COMPONENT_PAGES[PagesName.CasinoPage].preload();
  }, []);

  useEffect(() => {
    location.state?.scrollPosition &&
      ((activeCategory && activeCategory?.image) || isHardcodedCategory) &&
      window.scroll(0, location.state.scrollPosition);
  }, [activeCategory]);

  const renderCategory = () => {
    switch (params.category) {
      case 'favourite':
      case 'recent':
        return <CasinoUserCategory />;
      case 'new':
        return (
          <CasinoFilteredCategory
            filter={game => game?.features?.includes('new')}
            title={t('new_category')}
            icon={icon?.new as string}
          />
        );
      case 'featured':
        return (
          <CasinoFilteredCategory
            filter={game => game?.features?.includes('featured')}
            title={t('featured_category')}
            icon={icon?.featured as string}
          />
        );
      default:
        return <CasinoCategory />;
    }
  };

  return (
    <StyledCasinoPage className="styled-casino-page">
      {isHardcodedCategory && hardcodedBanner && (
        <Banner images={[{ image: hardcodedBanner?.image }]} />
      )}
      {activeCategory?.image && (
        <Banner images={[{ image: activeCategory?.image }]} />
      )}
      <CasinoFilters />
      {renderCategory()}
      <CasinoSearchContainer />
      <CasinoBottomNav />
    </StyledCasinoPage>
  );
};

export default CasinoCategoryPage;
