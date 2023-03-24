import React, { useEffect } from 'react';
import LeftSidebar from './LeftSidebar';
import Footer from './Footer';
import { isDesktop } from 'react-device-detect';
import clsx from 'clsx';
import ErrorBoundary from '../../ErrorBoundary';
import { useConfig } from '../../../hooks/useConfig';
import { useHistory, useLocation } from 'react-router-dom';
import { ConfigLoaded } from '../../../types/Config';
import NotFoundPage from '../pages/notFoundPage';
import BankingNav from '../components/BankingNav';
import CookieConsent from '../../xcasino/components/CookieConsent';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state';

let prevPathname: string | null = null;

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const showSb = useSelector((state: RootState) => state.tgLabSb.show);
  const { configLoaded } = useConfig((prev, next) => {
    const configLoaded = prev.configLoaded === next.configLoaded;
    const localeEqual = prev.locale === next.locale;
    return configLoaded && localeEqual;
  });

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

  return (
    <>
      <div className="layout-wrp">
        <ErrorBoundary>
          <LeftSidebar />
        </ErrorBoundary>
        <main
          className={clsx(
            'main',
            isDesktop && 'main-desktop-width',
            showSb && 'show-sb',
          )}
        >
          {configLoaded === ConfigLoaded.Loaded && children}
          {configLoaded === ConfigLoaded.Error && <NotFoundPage />}
        </main>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        <ErrorBoundary>
          <BankingNav />
        </ErrorBoundary>
        <ErrorBoundary>
          <CookieConsent />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default PageLayout;
