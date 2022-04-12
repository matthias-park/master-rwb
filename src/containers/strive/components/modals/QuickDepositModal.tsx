import React from 'react';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import DepositPage from '../../pages/depositPage';

const QuickDepositModal = () => {
  const { disableModal, activeModal } = useModal();
  const modalActive = activeModal === ComponentName.QuickDepositModal;

  return (
    <GenericModal
      isCentered
      show={modalActive}
      hideCallback={() => disableModal(ComponentName.QuickDepositModal)}
    >
      <>
        <DepositPage depositForm />
      </>
    </GenericModal>
  );
};

export default QuickDepositModal;
