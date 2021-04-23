import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../hooks/useI18n';
import Lockr from 'lockr';
import { stringToMiliseconds } from '../../utils/index';
import { ComponentName } from '../../constants';
import { useModal } from '../../hooks/useModal';
import { useAuth } from '../../hooks/useAuth';
import { usePrevious } from '../../hooks';

const ResponsibleGamblingModal = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const prevUser = usePrevious(user.logged_in);
  const intervalRef = useRef(0);
  const { activeModal, enableModal, disableModal } = useModal();
  const modalActive = activeModal === ComponentName.ResponsibleGamblingModal;
  useEffect(() => {
    const setModal = () => {
      enableModal(ComponentName.ResponsibleGamblingModal);
    };
    const interval = stringToMiliseconds(
      Lockr.get('responsibleGamlingInterval', '0:20:0'),
    );
    if (!modalActive && user.logged_in && interval) {
      if (user.logged_in && !prevUser && user.login_click) {
        setModal();
      } else {
        intervalRef.current = setInterval(setModal, interval);
      }
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
