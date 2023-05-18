import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../src/hooks/useAuth';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { getApi } from '../../../../utils/apiUtils';
import LoadingButton from '../../../../components/LoadingButton';
import { mutate } from 'swr';

const DepositThresholdModal = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [updatingAcknowledgment, setUpdatingAcknowledgment] = useState<boolean>(
    false,
  );
  const { activeModal, disableModal, enableModal } = useModal();
  const hideModal = () => disableModal(ComponentName.DepositThresholdModal);
  const userAcknowledgmentOfThreshold = async () => {
    setUpdatingAcknowledgment(true);
    await getApi<RailsApiResponse<any | null>>(
      '/railsapi/v1/deposits/set_informed_threshold',
    ).then(res => {
      mutate('/restapi/v1/user/status');
      setUpdatingAcknowledgment(false);
      hideModal();
    });
  };

  useEffect(() => {
    if (user.deposit_threshold_amount! > 0) {
      enableModal(ComponentName.DepositThresholdModal);
    }
  }, [user.deposit_threshold_amount]);

  if (!(activeModal === ComponentName.DepositThresholdModal) || !user.logged_in)
    return null;
  return (
    <GenericModal
      isCentered
      isStatic
      withoutClose
      show
      hideCallback={() => hideModal()}
      className="pb-5"
    >
      <h2 className="mb-2 modal-title">{t('deposit_threshold_modal_title')}</h2>
      <p className="mb-3">
        {t('deposit_threshold_modal_text').replace(
          'thresholdAmount', // makeshift way of making the amount dynamic
          user.deposit_threshold_amount,
        )}
      </p>
      <div className="d-flex justify-content-center">
        <LoadingButton
          variant="primary"
          className="mr-2"
          onClick={userAcknowledgmentOfThreshold}
          loading={updatingAcknowledgment}
        >
          {t('deposit_threshold_modal_btn')}
        </LoadingButton>
      </div>
    </GenericModal>
  );
};

export default DepositThresholdModal;
