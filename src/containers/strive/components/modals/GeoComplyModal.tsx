import React, { useEffect, useMemo } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName, PagesName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import useGeoComply from '../../../../hooks/useGeoComply';
import { GeoComplyErrorCodes } from '../../../../types/GeoComply';
import { useLocation } from 'react-router';
import isEqual from 'lodash.isequal';
import { useConfig } from '../../../../hooks/useConfig';
import { matchPath } from 'react-router-dom';

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

  return (
    <GenericModal
      isCentered
      show={
        activeModal === ComponentName.GeoComplyModal &&
        errorCode != null &&
        !shouldModalHide
      }
      hideCallback={() => hideModal()}
      className="pb-5"
    >
      <h2 className="mb-2 modal-title">{t('geo_comply_modal_title')}</h2>
      <p className="mb-3">{jsxT(`geo_comply_error_${errorCode}`)}</p>
      <>
        {errorCode === 612 && (
          <div className="geocomply-links">
            <a
              href={t('geocomply_windows_download_link')}
              className="geocomply-link"
            >
              <i className={`icon icon-${window.__config__.name}-windows8`}></i>
              {t('geocomply_windows_download')}
            </a>
            <a
              href={t('geocomply_mac_download_link')}
              className="geocomply-link"
            >
              <i className={`icon icon-${window.__config__.name}-appleinc`}></i>
              {t('geocomply_mac_download')}
            </a>
          </div>
        )}
      </>
    </GenericModal>
  );
};

export default GeoComplyModal;
