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
import { Route, Switch } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import NotFoundPage from './notFoundPage';

const LoadableFaqPage = loadable(() => import('./faqPage'));
const LoadableLoginPage = loadable(() => import('./loginPage'));
const LoadableRegisterPage = loadable(() => import('./registerPage'));

export const COMPONENT_PAGES = {
  bonus: BonusPage,
  cookiePolicy: CookiePolicyPage,
  deposit: DepositPage,
  faq: LoadableFaqPage,
  home: HomePage,
  limits: LimitsPage,
  login: LoadableLoginPage,
  promotions: PromotionsPage,
  register: LoadableRegisterPage,
  settings: SettingsPage,
  sports: SportsPage,
  withdrawal: WithdrawalPage,
  transactions: TransactionsPage,
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
            exact={true}
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
