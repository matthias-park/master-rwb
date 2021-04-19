import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import Lockr from 'lockr';
import { stringToMiliseconds } from '../../utils/index';
import { ComponentName } from '../../constants';
import { useModal } from '../../hooks/useModal';

const ResponsibleGamblingModal = () => {
  const { user } = useConfig(
    (prev, next) => prev.user.logged_in === next.user.logged_in,
  );
  const { t } = useI18n();
  const intervalRef = useRef(0);
  const { isModalActive, enableModal, disableModal } = useModal();
  const modalActive = isModalActive(ComponentName.ResponsibleGamblingModal);
  useEffect(() => {
    const setModal = () => {
      enableModal(ComponentName.ResponsibleGamblingModal);
    };
    const interval = stringToMiliseconds(
      Lockr.get('responsibleGamlingInterval', '0:20:0'),
    );
    if (!modalActive && user.logged_in && interval) {
      intervalRef.current = setInterval(setModal, interval);
    }
    return () => clearInterval(intervalRef.current);
  }, [modalActive, user]);

  const hideModal = () => disableModal(ComponentName.ResponsibleGamblingModal);

  return (
    <GenericModal
      show={modalActive}
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
