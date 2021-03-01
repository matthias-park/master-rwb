import React, { useEffect } from 'react';
import KambiSportsbook from '../KambiSportsbook';

const SportsPage = () => {
  useEffect(() => {
    document.getElementById('root')?.classList.remove('sb-hidden');
    return () => {
      document.getElementById('root')?.classList.add('sb-hidden');
    };
  }, []);
  return <KambiSportsbook />;
};

export default SportsPage;
