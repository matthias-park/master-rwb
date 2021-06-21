import React from 'react';
import { useConfig } from '../../../hooks/useConfig';
import KambiSportsbook from '../../KambiSportsbook';

const SportsRetailPage = () => {
  const { locale } = useConfig((prev, next) => !!prev.locale === !!next.locale);
  if (!locale) return null;
  return <KambiSportsbook retail />;
};
export default SportsRetailPage;
