import React from 'react';
import loadable from '@loadable/component';
import ProtectedRoute from './ProtectedRoute';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import { ComponentName, PagesName } from '../../constants';
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
  [PagesName.DepositPage]: AsyncPage('depositPage'),
  [PagesName.HomePage]: AsyncPage('homePage'),
  [PagesName.LimitsPage]: AsyncPage('limitsPage'),
  [PagesName.PromotionsPage]: AsyncPage('promotionsPage'),
  [PagesName.RegisterPage]: AsyncPage('registerPage'),
  [PagesName.SettingsPage]: AsyncPage('settingsPage'),
  [PagesName.SportsPage]: AsyncPage('sportsPage'),
  [PagesName.TransactionsPage]: AsyncPage('transactionsPage'),
  [PagesName.WithdrawalPage]: AsyncPage('withdrawalPage'),
  [PagesName.NotFoundPage]: AsyncPage('notFoundPage'),
  [PagesName.TemplatePage]: AsyncPage('templatePage'),
  [PagesName.ForgotPasswordPage]: AsyncPage('forgotPasswordPage'),
  [PagesName.ResetPasswordPage]: AsyncPage('resetPasswordPage'),
  [PagesName.ForgotLoginPage]: AsyncPage('forgotLoginPage'),
  [PagesName.ContactUsPage]: AsyncPage('contactUsPage'),
  [PagesName.SitemapPage]: AsyncPage('sitemapPage'),
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
            COMPONENT_PAGES[PagesName.TemplatePage];

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
