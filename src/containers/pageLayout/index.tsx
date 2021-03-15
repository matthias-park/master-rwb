import React, { useEffect, useMemo } from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import { useHistory, useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { useConfig } from '../../hooks/useConfig';
import ErrorBoundary from '../ErrorBoundary';
import { useI18n } from '../../hooks/useI18n';
import useGTM from '../../hooks/useGTM';

let prevPathname: string | null = null;

const PageLayout = ({ children }) => {
  const sendDataToGTM = useGTM();
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { user, helpBlock, sidebars, routes, locale } = useConfig(
    (prev, next) => {
      const userEqual = prev.user.loading === next.user.loading;
      const configLoaded = prev.configLoaded === next.configLoaded;
      const localeEqual = prev.locale === next.locale;
      return userEqual && configLoaded && localeEqual;
    },
  );
  const history = useHistory();
  const sidebar = useMemo(
    () =>
      !user.loading &&
      sidebars?.find(sidebar => sidebar.some(link => link.link === pathname)),
    [sidebars, pathname, user.loading],
  );
  const route = useMemo(() => routes.find(route => route.path === pathname), [
    routes,
    pathname,
  ]);
  const rightSidebarLayout = useMemo(() => {
    return !!helpBlock && !!route && helpBlock.includes(route.id);
  }, [pathname, route, helpBlock]);
  useEffect(() => {
    if (prevPathname !== pathname) {
      sendDataToGTM({
        'tglab.VirtualUrl': `/${locale}${pathname}`,
        'tglab.VirtualTitle': route ? `${t(`sitemap_${route.name}`)}` : '',
        event: 'VirtualPageView',
      });
    }
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
    prevPathname = pathname;
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
