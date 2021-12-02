import React, { useEffect } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import useGeoComply from '../../../../hooks/useGeoComply';
import { GeoComplyErrorCodes } from '../../../../types/GeoComply';

const GeoComplyModal = () => {
  const { t, jsxT } = useI18n();
  const {
    activeModal,
    disableModal,
    enableModal,
    allActiveModals,
  } = useModal();
  const { errorCode } = useGeoComply() || {};
  const hideModal = () => disableModal(ComponentName.GeoComplyModal);

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
      show={activeModal === ComponentName.GeoComplyModal && errorCode != null}
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
