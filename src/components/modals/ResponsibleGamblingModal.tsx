import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import Lockr from 'lockr';
import { stringToMiliseconds } from '../../utils/index';

const ResponsibleGamblingModal = () => {
  const { user } = useConfig();
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
    <Modal show={showModal} onHide={hideModal} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('responsible_gambling_title')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{t('responsible_gambling_body')}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={hideModal} variant="secondary" className="mx-auto">
          {t('responsible_gambling_close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResponsibleGamblingModal;
