import React from 'react';
import loadable from '@loadable/component';
import ProtectedRoute from 'containers/pages/ProtectedRoute';
import { Route, Switch } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { ComponentName } from '../../constants';
import PageLayout from 'containers/pageLayout';
import Spinner from 'react-bootstrap/Spinner';

const AsyncPage = (pageName: string) =>
  loadable(() => import(`./${pageName}`), {
    fallback: (
      <div className="w-100 d-flex justify-content-center pt-5">
        <Spinner animation="border" variant="white" className="mx-auto" />
      </div>
    ),
  });

export const COMPONENT_PAGES = {
  [ComponentName.BonusPage]: AsyncPage('bonusPage'),
  [ComponentName.CookiePolicyPage]: AsyncPage('cookiePolicyPage'),
  [ComponentName.DepositPage]: AsyncPage('depositPage'),
  [ComponentName.FaqPage]: AsyncPage('faqPage'),
  [ComponentName.HomePage]: AsyncPage('homePage'),
  [ComponentName.LimitsPage]: AsyncPage('limitsPage'),
  [ComponentName.PromotionsPage]: AsyncPage('promotionsPage'),
  [ComponentName.RegisterPage]: AsyncPage('registerPage'),
  [ComponentName.SettingsPage]: AsyncPage('settingsPage'),
  [ComponentName.SportsPage]: AsyncPage('sportsPage'),
  [ComponentName.TransactionsPage]: AsyncPage('transactionsPage'),
  [ComponentName.WithdrawalPage]: AsyncPage('withdrawalPage'),
  [ComponentName.NotFoundPage]: AsyncPage('notFoundPage'),
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
