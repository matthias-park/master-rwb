import React, { useEffect } from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { PagesName, NAVIGATION_ROUTES } from '../../constants';
import { ConfigRoute } from '../../types/Config';
import { usePrevious } from '../../hooks/index';
import { useConfig } from '../../hooks/useConfig';
import ErrorBoundary from '../ErrorBoundary';

const pathsWithSidebar = NAVIGATION_ROUTES.filter(route =>
  [
    PagesName.DepositPage,
    PagesName.LimitsPage,
    PagesName.SettingsPage,
    PagesName.WithdrawalPage,
    PagesName.TransactionsPage,
    PagesName.FaqPage,
    PagesName.BettingRulesPage,
  ].includes(route.id),
);

const pathsWithRightSidebar = NAVIGATION_ROUTES.filter(route =>
  [
    PagesName.DepositPage,
    PagesName.LimitsPage,
    PagesName.SettingsPage,
    PagesName.WithdrawalPage,
    PagesName.TransactionsPage,
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
  const { user } = useConfig();
  const history = useHistory();
  const prevPathname = usePrevious(pathname);
  const sidebarLayout = !user.loading && pathMatch(pathsWithSidebar, pathname);
  const rightSidebarLayout = pathMatch(pathsWithRightSidebar, pathname);

  useEffect(() => {
    if (prevPathname)
      sessionStorage.setItem(
        `route-${prevPathname}`,
        window.scrollY.toString(),
      );
    const savedScroll =
      (history.action === 'POP' &&
        sessionStorage.getItem(`route-${pathname}`)) ||
      0;
    window.scrollTo(0, Number(savedScroll));
  }, [pathname]);

  return (
    <>
      <ErrorBoundary>
        <PageHeader />
      </ErrorBoundary>
      {sidebarLayout ? (
        <LayoutWithSidebar rightSidebar={rightSidebarLayout}>
          {children}
        </LayoutWithSidebar>
      ) : (
        <>
          {children}
          <ErrorBoundary>
            <PageFooter />
          </ErrorBoundary>
        </>
      )}
      <ErrorBoundary>
        <CookieConsent />
      </ErrorBoundary>
    </>
  );
};

export default PageLayout;
