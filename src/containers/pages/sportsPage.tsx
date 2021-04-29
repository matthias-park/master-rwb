import React from 'react';
import { useConfig } from '../../hooks/useConfig';
import KambiSportsbook from '../KambiSportsbook';

const SportsPage = () => {
  const { locale } = useConfig((prev, next) => !!prev.locale === !!next.locale);
  if (!locale) return null;
  return <KambiSportsbook />;
};
export default SportsPage;
