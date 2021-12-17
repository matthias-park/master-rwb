import React, { useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import useGTM from '../../hooks/useGTM';
import { useSelector } from 'react-redux';
import { RootState } from '../../state';
import LoginModal from '../xcasino/components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import ResetPasswordModal from './components/modals/ResetPasswordModal';
import LimitsModal from './components/modals/LimitsModal';
import ResendEmailModal from './components/modals/ResendEmailModal';
import MaxBalanceModal from './components/modals/MaxBalanceModal';
import TermsAndConditionsModal from './components/modals/TermsAndConditionsModal';
import { ComponentName } from '../../constants';
import loadable from '@loadable/component';

const LoadableActivateUserModal = loadable(
  () => import('./components/modals/ActivateUserModal'),
);

const Modals = () => {
  const { hasTranslations } = useI18n();
  const sendDataToGTM = useGTM();
  const activeModal = useSelector((state: RootState) => state.modals[0]);

  useEffect(() => {
    if (activeModal && typeof activeModal === 'string') {
      sendDataToGTM({
        'tglab.ActiveModal': activeModal,
        event: 'ModalActiveChange',
      });
    }
  }, [activeModal]);

  if (!hasTranslations) {
    return null;
  }
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <ForgotPasswordModal />
      <ResetPasswordModal />
      <ResendEmailModal />
      <MaxBalanceModal />
      <TermsAndConditionsModal />
      {window.__config__.componentSettings?.modals?.limits && <LimitsModal />}
      {activeModal === ComponentName.ActivateUserModal && (
        <LoadableActivateUserModal />
      )}
    </>
  );
};

export default Modals;
