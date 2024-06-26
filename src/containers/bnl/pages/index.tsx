import React, { useMemo } from 'react';
import loadable from '@loadable/component';
import ProtectedRoute from './ProtectedRoute';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { useConfig } from '../../../hooks/useConfig';
import { PagesName } from '../../../constants';
import Spinner from 'react-bootstrap/Spinner';
import ErrorBoundary from '../../ErrorBoundary';
import { useI18n } from '../../../hooks/useI18n';
import * as Sentry from '@sentry/react';

const AsyncPage = (pageName: string) =>
  loadable(
    () =>
      import(`./${pageName}`).catch(() => {
        Sentry.captureMessage(
          `Could not load page - ${pageName}`,
          Sentry.Severity.Critical,
        );
        window.location.reload();
        return 'div';
      }),
    {
      fallback: (
        <div className="w-100 d-flex justify-content-center pt-5 min-vh-70">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      ),
    },
  );

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
  [PagesName.LocaleSelectPage]: AsyncPage('localeSelectPage'),
  [PagesName.PersonalInfoPage]: AsyncPage('personalInfoPage'),
  [PagesName.CommunicationPreferencesPage]: AsyncPage(
    'communicationPreferencesPage',
  ),
  [PagesName.ChangePasswordPage]: AsyncPage('changePasswordPage'),
  [PagesName.CloseAccountPage]: AsyncPage('closeAccountPage'),
  [PagesName.LoginPage]: AsyncPage('loginPage'),
  [PagesName.SportsPlayRetailPage]: AsyncPage('sportsRetail'),
};

const Routes = () => {
  const { jsxT } = useI18n();
  const { routes, locale } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );
  const { pathname } = useLocation();
  const localeSelectRoute = useMemo(
    () => routes.find(route => route.id === PagesName.LocaleSelectPage)?.path,
    [routes],
  );
  if (
    pathname === window.location.pathname &&
    pathname !== localeSelectRoute &&
    pathname !== '/'
  )
    return null;
  return (
    <ErrorBoundary
      key={pathname}
      fallback={
        <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
          <h1 className="mb-4 text-center">{jsxT('page_error_fallback')}</h1>
        </main>
      }
    >
      <Switch key={pathname}>
        {routes.map(route => {
          if (locale && route.id === PagesName.LocaleSelectPage) {
            return <Redirect to="/" key="homepage" path={route.path} />;
          }
          if (!!locale && route.redirectTo) {
            return (
              <Redirect
                to={route.redirectTo}
                exact={route.exact ?? true}
                key={`${route.id}-${route.path}`}
                path={route.path}
              />
            );
          }
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
              sensitive
            />
          );
        })}
      </Switch>
    </ErrorBoundary>
  );
};

export default Routes;
