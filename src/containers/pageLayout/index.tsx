import React, { useEffect, useMemo } from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import { useHistory, useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { usePrevious } from '../../hooks/index';
import { useConfig } from '../../hooks/useConfig';
import ErrorBoundary from '../ErrorBoundary';

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { user, helpBlock, sidebars, routes } = useConfig();
  const history = useHistory();
  const prevPathname = usePrevious(pathname);
  const sidebar = useMemo(
    () =>
      !user.loading &&
      sidebars?.find(sidebar => sidebar.some(link => link.link === pathname)),
    [sidebars, pathname, user.loading],
  );
  const rightSidebarLayout = useMemo(() => {
    const route = routes.find(route => route.path === pathname);
    return !!helpBlock && !!route && helpBlock.includes(route.id);
  }, [pathname, routes, helpBlock]);

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
      {sidebar ? (
        <LayoutWithSidebar sidebar={sidebar} rightSidebar={rightSidebarLayout}>
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
