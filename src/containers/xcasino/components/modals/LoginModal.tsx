import React from 'react';
import { Modal } from 'react-bootstrap';
import { ComponentName } from '../../../../constants';
import { useI18n } from '../../../../hooks/useI18n';
import { useModal } from '../../../../hooks/useModal';
import LoginForm from '../LoginForm';
import GenericModalHeader from './GenericModalHeader';

const LoginModal = () => {
  const { activeModal, enableModal, disableModal } = useModal();
  const closeModal = () => disableModal(ComponentName.LoginModal);
  const { t } = useI18n();
  return (
    <Modal
      show={activeModal === ComponentName.LoginModal}
      onHide={closeModal}
      centered
      dialogClassName="login-modal"
    >
      <GenericModalHeader title={t('login_title')} handleClose={closeModal} />
      <Modal.Body>
        <LoginForm />
      </Modal.Body>
      <Modal.Footer>
        <span>{t('login_need_an_account')}</span>
        <p
          className="modal-link"
          onClick={() => {
            closeModal();
            enableModal(ComponentName.RegisterModal);
          }}
        >
          {t('login_register_link')}
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
