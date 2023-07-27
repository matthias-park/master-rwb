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
import { NavigationRoute } from '../../../types/api/PageConfig';
import { useCurrentRoute } from '../../../hooks';
import { useAuth } from '../../../hooks/useAuth';

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
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      ),
    },
  );

export const COMPONENT_PAGES = {
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
  [PagesName.RequiredDocuments]: AsyncPage('requiredDocumentsPage'),
  [PagesName.TaxPage]: AsyncPage('taxPage'),
  [PagesName.CasinoPage]: AsyncPage('casinoPage'),
  [PagesName.CasinoCategoryPage]: AsyncPage('casinoCategoryPage'),
  [PagesName.CasinoInnerPage]: AsyncPage('casinoInnerPage'),
  [PagesName.BonusesPage]: AsyncPage('bonusesPage'),
  [PagesName.RegisterActivationPage]: AsyncPage('registerActivationPage'),
  [PagesName.CasinoBetsPage]: AsyncPage('casinoBetsPage'),
  [PagesName.TransactionsSummaryPage]: AsyncPage('transactionsSummaryPage'),
};

interface CombinedRoutes extends NavigationRoute {
  routes: string[];
}

const Routes = () => {
  const { jsxT } = useI18n();
  const { user } = useAuth();
  const { routes, locale } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );
  const { pathname } = useLocation();
  const currentRoute = useCurrentRoute();
  const localeSelectRoute = useMemo(
    () => routes.find(route => route.id === PagesName.LocaleSelectPage)?.path,
    [routes],
  );
  const formattedRoutes = useMemo(() => {
    return routes.reduce((obj: CombinedRoutes[], route) => {
      const pageIndex = obj.findIndex(
        page => page.id === route.id && !page.redirectTo,
      );
      if (
        pageIndex !== -1 &&
        !route.redirectTo &&
        (!route.protected || user.logged_in)
      ) {
        obj[pageIndex].routes.push(route.path);
        if (route.exact != null) {
          obj[pageIndex].exact = route.exact;
        }
      } else {
        obj.push({ ...route, routes: [route.path] });
      }
      return obj;
    }, []);
  }, [routes.length, user.logged_in]);

  if (
    pathname === window.location.pathname &&
    pathname !== localeSelectRoute &&
    pathname !== '/'
  )
    return null;
  return (
    <ErrorBoundary
      key={currentRoute?.id || pathname}
      fallback={
        <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
          <h1 className="mb-4 text-center">{jsxT('page_error_fallback')}</h1>
        </main>
      }
    >
      <Switch key={currentRoute?.id || pathname}>
        {formattedRoutes.map(route => {
          if (locale && route.id === PagesName.LocaleSelectPage) {
            return null;
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
              key={`${route.id}-${route.routes.length}`}
              exact={route.exact ?? true}
              path={route.routes}
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
