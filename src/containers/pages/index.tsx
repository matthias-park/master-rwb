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
import { ComponentName } from '../../constants';
import PageLayout from 'containers/pageLayout';

const LoadableFaqPage = loadable(() => import('./faqPage'));
const LoadableRegisterPage = loadable(() => import('./registerPage'));

export const COMPONENT_PAGES = {
  [ComponentName.BonusPage]: BonusPage,
  [ComponentName.CookiePolicyPage]: CookiePolicyPage,
  [ComponentName.DepositPage]: DepositPage,
  [ComponentName.FaqPage]: LoadableFaqPage,
  [ComponentName.HomePage]: HomePage,
  [ComponentName.LimitsPage]: LimitsPage,
  [ComponentName.PromotionsPage]: PromotionsPage,
  [ComponentName.RegisterPage]: LoadableRegisterPage,
  [ComponentName.SettingsPage]: SettingsPage,
  [ComponentName.SportsPage]: SportsPage,
  [ComponentName.TransactionsPage]: TransactionsPage,
  [ComponentName.WithdrawalPage]: WithdrawalPage,
  [ComponentName.NotFoundPage]: NotFoundPage,
};

const Routes = () => {
  const { routes } = useConfig();

  return (
    <Switch>
      {routes.map(route => {
        const Page =
          COMPONENT_PAGES[route.id] ||
          COMPONENT_PAGES[ComponentName.NotFoundPage];

        if (!Page) {
          return null;
        }
        const RouteEl = route.protected ? ProtectedRoute : Route;
        return (
          <RouteEl
            key={route.id}
            exact={route.exact ?? true}
            path={route.path}
            render={props => (
              <PageLayout>
                <Page {...props} />
              </PageLayout>
            )}
          />
        );
      })}
    </Switch>
  );
};

export default Routes;
