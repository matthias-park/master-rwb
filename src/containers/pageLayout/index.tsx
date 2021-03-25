import React, { useEffect, useMemo, useRef } from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { useConfig } from '../../hooks/useConfig';
import ErrorBoundary from '../ErrorBoundary';
import { useI18n } from '../../hooks/useI18n';
import useGTM from '../../hooks/useGTM';
import Spinner from 'react-bootstrap/Spinner';
import { PagesName } from '../../constants';

let prevPathname: string | null = null;

const PageLoadingSpinner = ({ height }: { height: number }) => (
  <div
    className="w-100 d-flex justify-content-center"
    style={{ height: height > 0 ? height : 60 }}
  >
    <Spinner animation="border" variant="black" className="m-auto" />
  </div>
);

const PageLayout = ({ children }) => {
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const sendDataToGTM = useGTM();
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { user, helpBlock, sidebars, routes, locale, configLoaded } = useConfig(
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
      sidebars?.find(sidebar =>
        sidebar.some(link => pathname.includes(link.link)),
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
    if (prevPathname !== pathname && locale) {
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

  useEffect(() => {
    const localeSelectRoute = routes.find(
      route => route.id === PagesName.LocaleSelectPage,
    );
    if (!locale && localeSelectRoute && pathname !== localeSelectRoute.path) {
      history.push(localeSelectRoute.path);
    }
    if (locale && route?.id === localeSelectRoute?.id) {
      history.push('/');
    }
  }, [locale, routes]);

  const placeholderHeight =
    window.innerHeight -
    (headerRef.current?.offsetHeight || 0) -
    (footerRef.current?.offsetHeight || 0);

  if (configLoaded && !locale) {
    return children;
  }
  return (
    <>
      <ErrorBoundary>
        <PageHeader ref={headerRef} />
      </ErrorBoundary>
      {sidebar ? (
        <LayoutWithSidebar sidebar={sidebar} rightSidebar={rightSidebarLayout}>
          {configLoaded ? (
            children
          ) : (
            <PageLoadingSpinner height={placeholderHeight} />
          )}
        </LayoutWithSidebar>
      ) : (
        <>
          {configLoaded ? (
            children
          ) : (
            <PageLoadingSpinner height={placeholderHeight} />
          )}
          <ErrorBoundary>
            <PageFooter ref={footerRef} />
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
