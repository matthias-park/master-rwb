import React, { useEffect, useMemo } from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../components/CookieConsent';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { useConfig } from '../../../hooks/useConfig';
import { useUIConfig } from '../../../hooks/useUIConfig';
import ErrorBoundary from '../../ErrorBoundary';
import { useI18n } from '../../../hooks/useI18n';
import useGTM from '../../../hooks/useGTM';
import { PagesName } from '../../../constants';
import { ConfigLoaded } from '../../../types/Config';
import NotFoundPage from '../pages/notFoundPage';
import { useAuth } from '../../../hooks/useAuth';

let prevPathname: string | null = null;

const PageLayout = ({ children }) => {
  const sendDataToGTM = useGTM();
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { headerNav } = useUIConfig();
  const { helpBlock, sidebars, routes, locale, configLoaded } = useConfig(
    (prev, next) => {
      const configLoaded = prev.configLoaded === next.configLoaded;
      const localeEqual = prev.locale === next.locale;
      return configLoaded && localeEqual;
    },
  );
  const { user } = useAuth();
  const history = useHistory();
  const sidebar = useMemo(
    () =>
      !user.loading &&
      sidebars?.find(sidebar =>
        sidebar.some(
          link =>
            pathname.includes(link.link) ||
            link.children?.some(link => pathname.includes(link.link)),
        ),
      ),
    [sidebars, pathname, user.loading],
  );
  const route = useMemo(
    () => routes.find(route => !!matchPath(pathname, route)),
    [routes, pathname],
  );
  const rightSidebarLayout = useMemo(() => {
    return !!helpBlock && !!route && helpBlock.includes(route.id);
  }, [pathname, route, helpBlock]);
  useEffect(() => {
    if (
      locale &&
      configLoaded === ConfigLoaded.Loaded &&
      route?.id !== PagesName.LocaleSelectPage &&
      !user.loading
    ) {
      process.nextTick(() =>
        sendDataToGTM({
          'tglab.VirtualUrl': `/${locale}${pathname}`,
          'tglab.VirtualTitle': route ? `${t(route.name)}` : '',
          event: 'VirtualPageView',
        }),
      );
    }
  }, [pathname, user.loading, configLoaded]);
  useEffect(() => {
    if (prevPathname && window.scrollY)
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

  useEffect(() => {
    const localeSelectRoute = routes.find(
      route => route.id === PagesName.LocaleSelectPage,
    );
    if (
      configLoaded !== ConfigLoaded.Loading &&
      !locale &&
      localeSelectRoute &&
      pathname !== localeSelectRoute.path
    ) {
      history.push(localeSelectRoute.path);
    }
  }, [locale, routes]);

  if (configLoaded === ConfigLoaded.Loading) {
    return null;
  }
  if (configLoaded === ConfigLoaded.Loaded && !locale) {
    return children;
  }
  return (
    <>
      <ErrorBoundary>
        <PageHeader />
      </ErrorBoundary>
      {sidebar ? (
        <LayoutWithSidebar
          sidebar={sidebar}
          rightSidebar={rightSidebarLayout}
          spacingClasses={headerNav.active && 'pt-xl-4'}
        >
          {children}
        </LayoutWithSidebar>
      ) : (
        <>
          {configLoaded === ConfigLoaded.Loaded && children}
          {configLoaded === ConfigLoaded.Error && <NotFoundPage />}
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
