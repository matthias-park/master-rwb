import React from 'react';
import { useConfig } from '../../../hooks/useConfig';
import TGLabSportsbook from '../../TGLabSportsbook';

const SportsPage = () => {
  const { locale } = useConfig((prev, next) => !!prev.locale === !!next.locale);
  if (!locale) return null;
  return <TGLabSportsbook liveSports />;
};
export default SportsPage;
