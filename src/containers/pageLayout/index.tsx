import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import { matchPath, useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { ComponentName, NAVIGATION_ROUTES } from '../../constants';
import { ConfigRoute } from '../../types/Config';

const pathsWithSidebar = NAVIGATION_ROUTES.filter(route =>
  [
    ComponentName.BonusPage,
    ComponentName.DepositPage,
    ComponentName.LimitsPage,
    ComponentName.SettingsPage,
    ComponentName.WithdrawalPage,
    ComponentName.TransactionsPage,
    ComponentName.CookiePolicyPage,
    ComponentName.FaqPage,
  ].includes(route.id),
);

const pathsWithRightSidebar = NAVIGATION_ROUTES.filter(route =>
  [
    ComponentName.BonusPage,
    ComponentName.DepositPage,
    ComponentName.LimitsPage,
    ComponentName.SettingsPage,
    ComponentName.WithdrawalPage,
    ComponentName.TransactionsPage,
    ComponentName.CookiePolicyPage,
    ComponentName.FaqPage,
  ].includes(route.id),
);

const pathMatch = (routes: ConfigRoute[], currentPath: string) =>
  routes.some(route =>
    matchPath(currentPath, {
      path: route.path,
      exact: route.exact ?? true,
    }),
  );

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const sidebarLayout = pathMatch(pathsWithSidebar, pathname);
  const rightSidebarLayout = pathMatch(pathsWithRightSidebar, pathname);

  return (
    <>
      <PageHeader />
      {sidebarLayout ? (
        <LayoutWithSidebar rightSidebar={rightSidebarLayout}>
          {children}
        </LayoutWithSidebar>
      ) : (
        <>
          {children}
          <PageFooter />
        </>
      )}
      <CookieConsent />
    </>
  );
};

export default PageLayout;
