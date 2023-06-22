import React, { useEffect, useMemo } from 'react';
import PageHeader from './PageHeader';
import CookieConsent from '../components/CookieConsent';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';
import { useConfig } from '../../../hooks/useConfig';
import { useUIConfig } from '../../../hooks/useUIConfig';
import ErrorBoundary from '../../ErrorBoundary';
import { useI18n } from '../../../hooks/useI18n';
import useGTM from '../../../hooks/useGTM';
import {
  PagesName,
  ComponentName,
  ComponentSettings,
} from '../../../constants';
import { ConfigLoaded } from '../../../types/Config';
import NotFoundPage from '../pages/notFoundPage';
import { useAuth } from '../../../hooks/useAuth';
import loadable from '@loadable/component';
import { useModal } from '../../../hooks/useModal';
import { KYC_VALIDATOR_STATUS } from '../../../types/UserStatus';
import CanPlayStatus from '../../../types/api/user/CanPlayStatus';
import { useRoutePath } from '../../../hooks';

const LoadablePageColumnFooter = loadable(() => import('./PageColumnFooter'));
const LoadableGeoComplyAlert = loadable(
  () => import('../components/header/GeoComplyAlert'),
);
const LoadableDynamicAlertBanner = loadable(
  () => import('../components/header/DynamicAlertBanner'),
);
let prevPathname: string | null = null;

const PageLayout = ({ children }) => {
  const sendDataToGTM = useGTM();
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { enableModal } = useModal();
  const { headerNav } = useUIConfig();
  const { sidebars, routes, locale, configLoaded } = useConfig((prev, next) => {
    const configLoaded = prev.configLoaded === next.configLoaded;
    const localeEqual = prev.locale === next.locale;
    return configLoaded && localeEqual;
  });
  const { user, signout } = useAuth();
  const history = useHistory();
  const sidebar = useMemo(
    () =>
      !user.loading &&
      sidebars?.find(sidebar =>
        sidebar.some(
          link =>
            !link.onlyLink &&
            (pathname.includes(link.link) ||
              link.children?.some(link => pathname.includes(link.link))),
        ),
      ),
    [sidebars, pathname, user.loading],
  );
  const route = useMemo(
    () => routes.find(route => !!matchPath(pathname, route)),
    [routes, pathname],
  );
  const location = useLocation();
  const loginPage = useRoutePath(PagesName.LoginPage);
  const activationPage = useRoutePath(PagesName.RegisterActivationPage);

  useEffect(() => {
    if (
      user.logged_in &&
      location.pathname !== loginPage &&
      location.pathname !== activationPage &&
      !!!user.id
    ) {
      signout();
    }
  }, [location.pathname]);

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

  const { showValidatorStatusBanner } = ComponentSettings!;

  if (configLoaded === ConfigLoaded.Loading) {
    return null;
  }
  if (configLoaded === ConfigLoaded.Loaded && !locale) {
    return children;
  }
  const userSuspended = user.canPlay === CanPlayStatus.TimeOut;

  return (
    <div className="page-wrp">
      <ErrorBoundary>
        <PageHeader />
      </ErrorBoundary>
      {user.logged_in && !!ComponentSettings?.header?.geoComplyStatusAlert && (
        <LoadableGeoComplyAlert />
      )}
      {showValidatorStatusBanner && user.logged_in && (
        <LoadableDynamicAlertBanner
          variant={'danger'}
          show={
            !!user.validator_status &&
            user.validator_status !== KYC_VALIDATOR_STATUS.Success
          }
          message={`validator_status_message_${user.validator_status}`}
          buttonTitle={
            user.validator_status === KYC_VALIDATOR_STATUS.ShouldAnswerKBA &&
            ComponentSettings?.modals.KBAQuestions
              ? 'Update'
              : undefined
          }
          buttonOnClick={
            user.validator_status === KYC_VALIDATOR_STATUS.ShouldAnswerKBA &&
            ComponentSettings?.modals.KBAQuestions
              ? () => enableModal(ComponentName.QuestionsKBAModal)
              : undefined
          }
        />
      )}
      {sidebar ? (
        <LayoutWithSidebar
          sidebar={sidebar}
          rightSidebar={false}
          spacingClasses={headerNav.active && 'pt-xl-4'}
        >
          {window.__config__.sbTechUrl && route?.id === PagesName.SportsPage ? (
            <div className="sb-iframe-wrp w-100 px-0 px-sm-4 pl-md-5 mb-4">
              {children}
            </div>
          ) : (
            children
          )}
        </LayoutWithSidebar>
      ) : (
        <>
          {configLoaded === ConfigLoaded.Loaded && children}
          {configLoaded === ConfigLoaded.Error && <NotFoundPage />}
          <ErrorBoundary>
            <LoadablePageColumnFooter />
          </ErrorBoundary>
        </>
      )}
      <ErrorBoundary>
        <CookieConsent />
      </ErrorBoundary>
    </div>
  );
};

export default PageLayout;
