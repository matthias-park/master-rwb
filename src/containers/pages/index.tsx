import React from 'react';
import loadable from '@loadable/component';
import HomePage from './homePage';
import CookiePolicyPage from './cookiePolicyPage';
import SportsPage from './sportsPage';
import PromotionsPage from './promotionsPage';
import BonusPage from './bonusPage';
import DepositPage from './depositPage';
import LimitsPage from './limitsPage';
import SettingsPage from './settingsPage';
import WithdrawalPage from './withdrawalPage';
import TransactionsPage from './transactionsPage';
import ProtectedRoute from 'containers/pages/ProtectedRoute';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import NotFoundPage from './notFoundPage';
import { ComponentName } from '../../constants';

const LoadableFaqPage = loadable(() => import('./faqPage'));
const LoadableLoginPage = loadable(() => import('./loginPage'));
const LoadableRegisterPage = loadable(() => import('./registerPage'));

export const COMPONENT_PAGES = {
  [ComponentName.BonusPage]: BonusPage,
  [ComponentName.CookiePolicyPage]: CookiePolicyPage,
  [ComponentName.DepositPage]: DepositPage,
  [ComponentName.FaqPage]: LoadableFaqPage,
  [ComponentName.HomePage]: HomePage,
  [ComponentName.LimitsPage]: LimitsPage,
  [ComponentName.LoginPage]: LoadableLoginPage,
  [ComponentName.PromotionsPage]: PromotionsPage,
  [ComponentName.RegisterPage]: LoadableRegisterPage,
  [ComponentName.SettingsPage]: SettingsPage,
  [ComponentName.SportsPage]: SportsPage,
  [ComponentName.TransactionsPage]: TransactionsPage,
  [ComponentName.WithdrawalPage]: WithdrawalPage,
};

const Routes = () => {
  const { routes } = useConfig();
  return (
    <Switch>
      {routes.map(route => {
        const page = COMPONENT_PAGES[route.id];
        if (!page) {
          return null;
        }
        const RouteEl = route.protected ? ProtectedRoute : Route;
        return (
          <RouteEl
            key={route.id}
            exact={route.exact ?? true}
            path={route.path}
            component={page}
          />
        );
      })}
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
