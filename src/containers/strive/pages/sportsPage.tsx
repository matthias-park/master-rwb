import loadable from '@loadable/component';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { PagesName } from '../../../constants';
import { useConfig } from '../../../hooks/useConfig';
import { RootState } from '../../../state';

const LoadableKambiSportsbook = loadable(() => import('../../KambiSportsbook'));
const LoadableBetsonSportsbook = loadable(
  () => import('../../BetsonSportsbook'),
);
const BetssonRouteName = 'betssonSb_link';

const SportsPage = () => {
  const { pathname } = useLocation();
  const isBetssonSbActive = useSelector((state: RootState) => {
    const routes = state.config.routes;
    const betssonRoute = routes.find(
      route =>
        PagesName.SportsPage === route.id && route.name === BetssonRouteName,
    );
    return betssonRoute?.path === pathname;
  });
  const { locale } = useConfig((prev, next) => !!prev.locale === !!next.locale);
  if (!locale) return null;

  if (isBetssonSbActive) {
    return <LoadableBetsonSportsbook />;
  }
  return <LoadableKambiSportsbook />;
};

export default SportsPage;
