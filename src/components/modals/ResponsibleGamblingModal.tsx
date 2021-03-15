import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import GenericModal from './GenericModal';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import Lockr from 'lockr';
import { stringToMiliseconds } from '../../utils/index';

const ResponsibleGamblingModal = () => {
  const { user } = useConfig(
    (prev, next) => prev.user.logged_in === next.user.logged_in,
  );
  const { t } = useI18n();
  const intervalRef = useRef(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const setModal = () => {
      setShowModal(user.logged_in);
    };
    const interval = stringToMiliseconds(
      Lockr.get('responsibleGamlingInterval', '0:20:0'),
    );
    if (!showModal && user.logged_in && interval) {
      intervalRef.current = setInterval(setModal, interval);
    }
    return () => clearInterval(intervalRef.current);
  }, [showModal, user]);

  const hideModal = () => setShowModal(false);

  return (
    <GenericModal
      show={showModal}
      hideCallback={hideModal}
      isCentered={true}
      isStatic={true}
      withoutClose={true}
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
