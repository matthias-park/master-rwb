import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import Lockr from 'lockr';
import { stringToMiliseconds } from '../../utils/index';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ComponentName } from '../../constants';

const ResponsibleGamblingModal = () => {
  const { user } = useConfig(
    (prev, next) => prev.user.logged_in === next.user.logged_in,
  );
  const { t } = useI18n();
  const intervalRef = useRef(0);
  const { showModal, setShowModal } = useUIConfig();

  useEffect(() => {
    const setModal = () => {
      setShowModal(ComponentName.ResponsibleGamblingModal);
    };
    const interval = stringToMiliseconds(
      Lockr.get('responsibleGamlingInterval', '0:20:0'),
    );
    if (!showModal && user.logged_in && interval) {
      intervalRef.current = setInterval(setModal, interval);
    }
    return () => clearInterval(intervalRef.current);
  }, [showModal, user]);

  const hideModal = () => setShowModal(null);

  return (
    <GenericModal
      show={showModal === ComponentName.ResponsibleGamblingModal}
      hideCallback={hideModal}
      isCentered={true}
      isStatic={true}
      className="text-center"
    >
      <h2 className="mb-3 mt-4">{t('responsible_gambling_title')}</h2>
      <p>{t('responsible_gambling_body')}</p>
      <Button onClick={hideModal} variant="primary" className="mx-auto mt-4">
        {t('responsible_gambling_close')}
      </Button>
    </GenericModal>
  );
};

export default ResponsibleGamblingModal;
