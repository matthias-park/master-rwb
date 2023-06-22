import React, { useEffect } from 'react';
import { ComponentName } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import DepositPage from '../../pages/depositPage';
import { useLocation } from 'react-router-dom';
import Lockr from 'lockr';
import { useAuth } from '../../../../hooks/useAuth';

const QuickDepositModal = () => {
  const { user } = useAuth();
  const { disableModal, activeModal } = useModal();
  const modalActive = activeModal === ComponentName.QuickDepositModal;
  const location = useLocation();

  useEffect(() => {
    if (modalActive) {
      Lockr.set('prevPath', location.pathname);
    }
  }, [modalActive]);

  useEffect(() => {
    disableModal(ComponentName.QuickDepositModal);
  }, [user.balances]);

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
