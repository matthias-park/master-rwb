import React from 'react';
import loadable from '@loadable/component';
import ProtectedRoute from './ProtectedRoute';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { useConfig } from '../../../hooks/useConfig';
import { PagesName } from '../../../constants';
import Spinner from 'react-bootstrap/Spinner';
import ErrorBoundary from '../../ErrorBoundary';
import { useI18n } from '../../../hooks/useI18n';
import 'swiper/swiper.scss';
import { useCompleteRegistration } from '../../../hooks/useCompleteRegistration';
import { useAuth } from '../../../hooks/useAuth';

const AsyncPage = (pageName: string) =>
  loadable(
    () =>
      import(`./${pageName}`).catch(() => {
        window.location.reload();
        return 'div';
      }),
    {
      fallback: (
        <div className="w-100 d-flex justify-content-center pt-5 min-vh-100">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      ),
    },
  );

export const COMPONENT_PAGES = {
  [PagesName.HomePage]: AsyncPage('homePage'),
  [PagesName.NotFoundPage]: AsyncPage('notFoundPage'),
  [PagesName.WelcomePage]: AsyncPage('welcomePage'),
  [PagesName.CasinoPage]: AsyncPage('casinoPage'),
  [PagesName.LiveCasinoPage]: AsyncPage('liveCasinoPage'),
  [PagesName.CasinoCategoryPage]: AsyncPage('casinoCategoryPage'),
  [PagesName.CasinoInnerPage]: AsyncPage('casinoInnerPage'),
  [PagesName.PromotionsPage]: AsyncPage('promotionsPage'),
  [PagesName.PromotionsInnerPage]: AsyncPage('promotionsInnerPage'),
  [PagesName.PersonalInfoPage]: AsyncPage('personalInfoPage'),
  [PagesName.LimitsPage]: AsyncPage('limitsPage'),
  [PagesName.ChangePasswordPage]: AsyncPage('changePasswordPage'),
  [PagesName.CommunicationPreferencesPage]: AsyncPage('newsLetterPage'),
  [PagesName.TransactionsPage]: AsyncPage('transactionsPage'),
  [PagesName.RequiredDocuments]: AsyncPage('documentsPage'),
  [PagesName.DepositPage]: AsyncPage('depositPage'),
  [PagesName.WithdrawalPage]: AsyncPage('withdrawalPage'),
  [PagesName.GameRoundsPage]: AsyncPage('gameRoundsPage'),
  [PagesName.VerifyAccountPage]: AsyncPage('verifyAccountPage'),
  [PagesName.RewardsDashboardPage]: AsyncPage('rewardsDashboardPage'),
  [PagesName.RedeemRewardsPage]: AsyncPage('redeemRewardsPage'),
  [PagesName.TemplatePage]: AsyncPage('infoTemplatePage'),
  [PagesName.InfoAffiliatePage]: AsyncPage('infoAffiliatePage'),
  [PagesName.InfoPaymentPage]: AsyncPage('infoPaymentPage'),
  [PagesName.SportsPage]: AsyncPage('sportsPage'),
  [PagesName.LiveSportsPage]: AsyncPage('liveSportsPage'),
  [PagesName.RegisterPage]: AsyncPage('registrationPage'),
  [PagesName.CasinoGameInfoPage]: AsyncPage('casinoGameInfoPage'),
};

const Routes = () => {
  const { jsxT } = useI18n();
  const { routes, locale } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );

  const { registrationIncomplete } = useCompleteRegistration();
  const { user } = useAuth();

  const { pathname } = useLocation();
  return (
    <ErrorBoundary
      key={pathname}
      fallback={
        <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
          <h1 className="mb-4 text-center">{jsxT('page_error_fallback')}</h1>
        </main>
      }
    >
      {user.logged_in && registrationIncomplete ? (
        <Switch>
          {routes.map(route => {
            const permittedRoute =
              route.path.includes('/info/') ||
              route.path.includes('complete-registration');
            const RouteEl = route.protected ? ProtectedRoute : Route;
            return (
              permittedRoute && (
                <RouteEl
                  key={`${route.id}-${route.path}`}
                  exact={route.exact ?? true}
                  path={route.path}
                  component={COMPONENT_PAGES[route.id]}
                  sensitive
                />
              )
            );
          })}
          {!pathname.includes('/info/') && (
            <Redirect to="/complete-registration" from="*" />
          )}
        </Switch>
      ) : (
        <Switch key={pathname}>
          {routes.map(route => {
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
                key={`${route.id}-${route.path}`}
                exact={route.exact ?? true}
                path={route.path}
                component={Page}
                sensitive
              />
            );
          })}
        </Switch>
      )}
    </ErrorBoundary>
  );
};

export default Routes;
