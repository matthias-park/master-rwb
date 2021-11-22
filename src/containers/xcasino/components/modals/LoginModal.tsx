import React from 'react';
import { Modal } from 'react-bootstrap';
import { ComponentName } from '../../../../constants';
import { useModal } from '../../../../hooks/useModal';
import LoginForm from '../LoginForm';
import GenericModalHeader from './GenericModalHeader';

const LoginModal = () => {
  const { activeModal, enableModal, disableModal } = useModal();
  const closeModal = () => disableModal(ComponentName.LoginModal);
  return (
    <Modal
      show={activeModal === ComponentName.LoginModal}
      onHide={closeModal}
      centered
      dialogClassName="login-modal"
    >
      <GenericModalHeader title="Welcome Back" handleClose={closeModal} />
      <Modal.Body>
        <LoginForm />
      </Modal.Body>
      <Modal.Footer>
        <span>No Account?</span>
        <p
          className="modal-link"
          onClick={() => {
            closeModal();
            enableModal(ComponentName.RegisterModal);
          }}
        >
          Register Now
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
