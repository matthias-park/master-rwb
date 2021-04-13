import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import { VALIDATOR_STATUS } from '../../types/UserStatus';

const ValidationFailedModal = () => {
  const { user } = useConfig(
    (prev, next) => prev.user.validator_status === next.user.validator_status,
  );
  const { t } = useI18n();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (
      [VALIDATOR_STATUS.MINOR_ERROR, VALIDATOR_STATUS.MAJOR_ERROR].includes(
        user.validator_status || 0,
      )
    ) {
      setShowModal(true);
    }
  }, [user]);

  const hideModal = () => setShowModal(false);

  return (
    <GenericModal
      show={showModal}
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
