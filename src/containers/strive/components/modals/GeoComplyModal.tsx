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
  const { errorCode } = useGeoComply();
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
      <h2 className="mb-2 text-gray-800">{t('geo_comply_modal_title')}</h2>
      <p className="text-gray-700 mb-3">
        {errorCode != null ? jsxT(`geo_comply_error_${errorCode}`) : ''}
      </p>
    </GenericModal>
  );
};

export default GeoComplyModal;
