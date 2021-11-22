import React, { useEffect } from 'react';
import CasinoCategory from '../components/casino/CasinoCategory';
import Main from '../pageLayout/Main';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import { useI18n } from '../../../hooks/useI18n';
import { COMPONENT_PAGES } from './index';
import { PagesName } from '../../../constants';

const CasinoCategoryPage = () => {
  const { t } = useI18n();
  const { casinoType } = useCasinoConfig();

  useEffect(() => {
    casinoType === 'casino'
      ? COMPONENT_PAGES[PagesName.CasinoPage].preload()
      : COMPONENT_PAGES[PagesName.LiveCasinoPage].preload();
  }, []);

  return (
    <Main
      isCasino
      title={
        casinoType === 'casino' ? t('casino_title') : t('live_casino_title')
      }
      icon={`icon-${casinoType === 'casino' ? 'slots' : 'live-casino'}`}
    >
      <div className="casino-page fade-in">
        <div className="casino-page__content page-content">
          <CasinoCategory />
        </div>
      </div>
    </Main>
  );
};

export default CasinoCategoryPage;
