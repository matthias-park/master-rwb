import React, { useEffect } from 'react';
import { hideKambiSportsbook, showKambiSportsbook } from '../../utils/uiUtils';
import KambiSportsbook from '../KambiSportsbook';

const SportsPage = () => {
  useEffect(() => {
    showKambiSportsbook();
    return () => {
      hideKambiSportsbook();
    };
  }, []);
  return <KambiSportsbook />;
};

export default SportsPage;
