import React from 'react';
import loadable from '@loadable/component';
import ProtectedRoute from './ProtectedRoute';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { ComponentName } from '../../constants';
import Spinner from 'react-bootstrap/Spinner';
import ErrorBoundary from '../ErrorBoundary';

const AsyncPage = (pageName: string) =>
  loadable(() => import(`./${pageName}`), {
    fallback: (
      <div className="w-100 d-flex justify-content-center pt-5">
        <Spinner animation="border" variant="white" className="mx-auto" />
      </div>
    ),
  });

const COMPONENT_PAGES = {
  [ComponentName.DepositPage]: AsyncPage('depositPage'),
  [ComponentName.HomePage]: AsyncPage('homePage'),
  [ComponentName.LimitsPage]: AsyncPage('limitsPage'),
  [ComponentName.PromotionsPage]: AsyncPage('promotionsPage'),
  [ComponentName.RegisterPage]: AsyncPage('registerPage'),
  [ComponentName.SettingsPage]: AsyncPage('settingsPage'),
  [ComponentName.SportsPage]: AsyncPage('sportsPage'),
  [ComponentName.TransactionsPage]: AsyncPage('transactionsPage'),
  [ComponentName.WithdrawalPage]: AsyncPage('withdrawalPage'),
  [ComponentName.NotFoundPage]: AsyncPage('notFoundPage'),
  [ComponentName.TemplatePage]: AsyncPage('templatePage'),
  [ComponentName.ForgotPasswordPage]: AsyncPage('forgotPasswordPage'),
  [ComponentName.ResetPasswordPage]: AsyncPage('resetPasswordPage'),
  [ComponentName.ForgotLoginPage]: AsyncPage('forgotLoginPage'),
  [ComponentName.ContactUsPage]: AsyncPage('contactUsPage'),
  [ComponentName.SitemapPage]: AsyncPage('sitemapPage'),
};

const Routes = () => {
  const { routes } = useConfig();
  const { pathname } = useLocation();

  return (
    <ErrorBoundary key={pathname}>
      <Switch>
        {routes.map(route => {
          const Page =
            COMPONENT_PAGES[route.id] ||
            COMPONENT_PAGES[ComponentName.TemplatePage];

          if (!Page) {
            return null;
          }
          const RouteEl = route.protected ? ProtectedRoute : Route;
          return (
            <RouteEl
              key={`${route.id}-${route.path}`}
              exact={route.exact ?? true}
              path={route.path}
              component={Page}
            />
          );
        })}
      </Switch>
    </ErrorBoundary>
  );
};

export default Routes;
