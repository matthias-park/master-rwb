import React, { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName, Config, PagesName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import useGeoComply from '../../../../hooks/useGeoComply';
import { GeoComplyErrorCodes } from '../../../../types/GeoComply';
import { useLocation } from 'react-router';
import isEqual from 'lodash.isequal';
import { useConfig } from '../../../../hooks/useConfig';
import { matchPath } from 'react-router-dom';
import { isAndroid, isDesktop, isIOS } from 'react-device-detect';
import Link from '../../../../components/Link';
import { FranchiseNames } from '../../../../types/FranchiseNames';
import clsx from 'clsx';

const franchiseHasApp = [
  FranchiseNames.Gnogaz,
  FranchiseNames.DesertDiamond,
].includes(Config.name);

const DownloadLinks = ({ errorCode, isDesktop }) => {
  const { t } = useI18n();
  if (isIOS && franchiseHasApp) {
    return (
      <Link
        to={t('ios_app_link')}
        className={isDesktop ? 'geocomply-app-link' : 'mobile-app-link'}
      >
        <i className={`icon icon-appleinc`}></i>
        {t('geocomply_ios_download')}
      </Link>
    );
  } else if (isAndroid && franchiseHasApp) {
    return (
      <Link
        to={t('android_app_link')}
        className={isDesktop ? 'geocomply-app-link' : 'mobile-app-link'}
      >
        <i className={`icon icon-android`}></i>
        {t('geocomply_android_download')}
      </Link>
    );
  } else if (errorCode === 612) {
    return (
      <div className="geocomply-links">
        <a
          href={t('geocomply_windows_download_link')}
          className="geocomply-link"
        >
          <i className={`icon icon-${window.__config__.name}-windows8`}></i>
          {t('geocomply_windows_download')}
        </a>
        <a href={t('geocomply_mac_download_link')} className="geocomply-link">
          <i className={`icon icon-${window.__config__.name}-appleinc`}></i>
          {t('geocomply_mac_download')}
        </a>
      </div>
    );
  }
  return null;
};

const GeoComplyModal = () => {
  const { t, jsxT } = useI18n();
  const {
    activeModal,
    disableModal,
    enableModal,
    allActiveModals,
  } = useModal();
  const { pathname } = useLocation();
  const { errorCode } = useGeoComply() || {};
  const { routes } = useConfig((prev, next) =>
    isEqual(prev.routes, next.routes),
  );
  const hideModal = () => disableModal(ComponentName.GeoComplyModal);
  const [hideLivechat, setHideLivechat] = useState(isDesktop ? false : true);
  const [unreadIndicator, setUnreadIndicator] = useState(0);
  const isZendesk = Config.zendesk;
  const shouldModalHide = useMemo(
    () =>
      routes.find(route =>
        matchPath(pathname, {
          path: route.path,
          exact: route.exact ?? true,
        }),
      )?.id === PagesName.ResetPasswordPage,
    [routes, pathname],
  );
  if (isZendesk) {
    window.zE('messenger:on', 'unreadMessages', count => {
      populateUnreadIndicator(count);
    });
    window.zE('messenger', 'close');
    if (!isDesktop) {
      window.zE('messenger:on', 'close', () => {
        setHideLivechat(prevState => !prevState);
      });
      window.zE('messenger:set', 'zIndex', -9999999);
    }
  }
  useEffect(() => {
    if (
      errorCode &&
      ![
        GeoComplyErrorCodes.CLNT_OK,
        GeoComplyErrorCodes.CLNT_ERROR_LICENSE_EXPIRED,
        GeoComplyErrorCodes.CLNT_ERROR_INVALID_LICENSE_FORMAT,
        GeoComplyErrorCodes.CLNT_ERROR_CLIENT_LICENSE_UNAUTHORIZED,
      ].includes(errorCode)
    ) {
      enableModal(ComponentName.GeoComplyModal);
    } else if (
      activeModal === ComponentName.GeoComplyModal ||
      (allActiveModals.includes(ComponentName.GeoComplyModal) &&
        errorCode == null)
    ) {
      hideModal();
    }
  }, [errorCode]);

  useEffect(() => {
    if (isZendesk && !isDesktop) {
      if (hideLivechat) {
        window.zE('messenger:set', 'zIndex', -9999999);
      } else {
        window.zE('messenger', 'open');
        window.zE('messenger:set', 'zIndex', 9999999);
      }
    }
  }, [hideLivechat]);

  const message =
    useInternalTranslations ||
    (!errorMessage && errorCode) ||
    ErrorCodesInternalTranslations.includes(errorCode || 0)
      ? errorCode != null
        ? jsxT(`geo_comply_error_${errorCode}`)
        : ''
      : errorMessage;

  const openLivechat = () => {
    setHideLivechat(prevState => !prevState);
  };

  const populateUnreadIndicator = count => {
    if (!count) return setUnreadIndicator(0);
    setUnreadIndicator(count);
  };
  return (
    <>
      {isDesktop ||
        (!franchiseHasApp && (
          <GenericModal
            isCentered
            show={
              activeModal === ComponentName.GeoComplyModal &&
              errorCode != null &&
              !!message &&
              !shouldModalHide
            }
            hideCallback={() => hideModal()}
            className="pb-5"
          >
            <h2 className="mb-2 modal-title">{t('geo_comply_app_title')}</h2>
            <p className="mb-3">{message}</p>
            <DownloadLinks errorCode={errorCode} isDesktop={isDesktop} />
          </GenericModal>
        ))}
      {!isDesktop && franchiseHasApp && (
        <nav className="mobileApp-nav">
          <div className="mobileApp-nav__body">
            <h3 className="mobileApp-nav__body-title">
              {t('geo_comply_app_title')}
            </h3>
            <DownloadLinks errorCode={errorCode} isDesktop={isDesktop} />
          </div>
          {isZendesk && (
            <div
              className={clsx(
                'mobile-livechat',
                hideLivechat && 'mobile-livechat__hide',
              )}
            >
              <button
                className="mobile-livechat__buttons"
                onClick={openLivechat}
              >
                <i className={`icon icon-gcg-livechat`}></i>
                {unreadIndicator > 0 && (
                  <span id="unread-indicator">{unreadIndicator}</span>
                )}
              </button>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default GeoComplyModal;
