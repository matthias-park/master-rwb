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
import { useConfig } from '../../hooks/useConfig';
import ProtectedRoute from 'containers/pages/ProtectedRoute';
import { Route } from 'react-router-dom';

const LoadableFaqPage = loadable(() => import('./faqPage'));
const LoadableLoginPage = loadable(() => import('./loginPage'));
const LoadableRegisterPage = loadable(() => import('./registerPage'));

// interface Route {
//   path: string;
//   exact?: true;
//   component: (() => JSX.Element) | LoadableComponent<unknown>;
//   protectedRoute?: true;
// }

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
};

const Routes = () => {
  const { routes } = useConfig();
  return (
    <>
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
    </>
  );
};
// const routes: Route[] = [
//   {
//     path: '/',
//     exact: true,
//     component: HomePage,
//   },
//   {
//     path: '/cookie-policy',
//     exact: true,
//     component: CookiePolicyPage,
//   },
//   {
//     path: '/faq',
//     exact: true,
//     component: LoadableFaqPage,
//   },
//   {
//     path: '/sports',
//     exact: true,
//     component: SportsPage,
//   },
//   {
//     path: '/login',
//     exact: true,
//     component: LoadableLoginPage,
//   },
//   {
//     path: '/register',
//     exact: true,
//     component: LoadableRegisterPage,
//   },
//   {
//     path: '/promotions',
//     exact: true,
//     component: PromotionsPage,
//   },
//   {
//     path: '/bonus',
//     exact: true,
//     component: BonusPage,
//     protectedRoute: true,
//   },
//   {
//     path: '/deposit',
//     exact: true,
//     component: DepositPage,
//     protectedRoute: true,
//   },
//   {
//     path: '/limits',
//     exact: true,
//     component: LimitsPage,
//     protectedRoute: true,
//   },
//   {
//     path: '/settings',
//     exact: true,
//     component: SettingsPage,
//     protectedRoute: true,
//   },
//   {
//     path: '/withdrawal',
//     exact: true,
//     component: WithdrawalPage,
//     protectedRoute: true,
//   },
// ];

export default Routes;
