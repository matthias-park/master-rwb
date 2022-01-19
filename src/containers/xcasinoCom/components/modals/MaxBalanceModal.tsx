import React from 'react';
import GenericModalHeader from './GenericModalHeader';
import { Button, Modal } from 'react-bootstrap';
import { useModal } from '../../../../hooks/useModal';
import { ComponentName } from '../../../../constants';
import { useHistory } from 'react-router';

const MaxBalanceModal = () => {
  const { activeModal, enableModal, disableModal } = useModal();
  const history = useHistory();
  const closeModal = () => disableModal(ComponentName.MaxBalanceModal);

  return (
    <Modal
      show={activeModal === ComponentName.MaxBalanceModal}
      centered
      dialogClassName="max-balance-modal"
    >
      <GenericModalHeader title={'Add Limits'} handleClose={closeModal} />
      <Modal.Body>
        <p>Would you like to add Limits?</p>
        <Button
          as={'a'}
          href="account/play/play-limits"
          className="rounded-pill"
          onClick={closeModal}
        >
          Set Max Balance
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <span>Need Help?</span>
        <div
          className="modal-link"
          onClick={() => {
            closeModal();
            history.push('/');
          }}
        >
          Click Here
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default MaxBalanceModal;
