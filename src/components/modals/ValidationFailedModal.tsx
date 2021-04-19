import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import { VALIDATOR_STATUS } from '../../types/UserStatus';
import { useModal } from '../../hooks/useModal';
import { ComponentName } from '../../constants';

const ValidationFailedModal = () => {
  const { user } = useConfig(
    (prev, next) =>
      prev.user.validator_status === next.user.validator_status &&
      prev.user.logged_in === next.user.logged_in,
  );
  const { t } = useI18n();
  const {
    activeModal,
    allActiveModals,
    enableModal,
    disableModal,
  } = useModal();
  console.log(user);
  useEffect(() => {
    if (
      [VALIDATOR_STATUS.MINOR_ERROR, VALIDATOR_STATUS.MAJOR_ERROR].includes(
        user.validator_status || 0,
      )
    ) {
      enableModal(ComponentName.ValidationFailedModal);
    } else if (
      !user.logged_in &&
      allActiveModals.includes(ComponentName.ValidationFailedModal)
    ) {
      disableModal(ComponentName.ValidationFailedModal);
    }
  }, [user]);

  const hideModal = () => disableModal(ComponentName.ValidationFailedModal);

  return (
    <GenericModal
      show={activeModal === ComponentName.ValidationFailedModal}
      hideCallback={hideModal}
      isCentered={true}
      isStatic={true}
      className="text-center"
    >
      <h2 className="mb-3 mt-4">{t('validation_failed_title')}</h2>
      <p>{t(`validation_failed_body_${user.validator_status}`)}</p>
      <Button onClick={hideModal} variant="primary" className="mx-auto mt-4">
        {t('validation_failed_close')}
      </Button>
    </GenericModal>
  );
};

export default ValidationFailedModal;
