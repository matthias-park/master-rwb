import React, { useEffect } from 'react';
import CasinoLobby from '../components/casino/CasinoLobby';
import Main from '../pageLayout/Main';
import { useI18n } from '../../../hooks/useI18n';
import { COMPONENT_PAGES } from './index';
import { PagesName } from '../../../constants';

const CasinoPage = () => {
  const { t } = useI18n();

  useEffect(() => {
    COMPONENT_PAGES[PagesName.CasinoCategoryPage].preload();
  }, []);

  return (
    <Main isCasino title={t('casino_title')} icon="icon-slots">
      <div className="casino-page fade-in">
        <div className="casino-page__content page-content">
          <CasinoLobby />
        </div>
      </div>
    </Main>
  );
};

export default CasinoPage;
