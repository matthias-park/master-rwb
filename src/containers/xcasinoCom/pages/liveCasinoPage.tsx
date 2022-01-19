import React, { useEffect } from 'react';
import LiveCasinoLobby from '../components/casino/LiveCasinoLobby';
import Main from '../pageLayout/Main';
import { useI18n } from '../../../hooks/useI18n';
import { COMPONENT_PAGES } from './index';
import { PagesName } from '../../../constants';

const LiveCasinoPage = () => {
  const { t } = useI18n();

  useEffect(() => {
    COMPONENT_PAGES[PagesName.CasinoCategoryPage].preload();
  }, []);

  return (
    <Main isCasino title={t('live_casino_title')} icon="icon-live-casino">
      <div className="casino-page fade-in">
        <div className="casino-page__content page-content">
          <LiveCasinoLobby />
        </div>
      </div>
    </Main>
  );
};

export default LiveCasinoPage;
