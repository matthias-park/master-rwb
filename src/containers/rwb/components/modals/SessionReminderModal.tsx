import React, { useEffect } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import {
  ComponentName,
  ComponentSettings,
  LocalStorageKeys,
} from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import LoadingButton from '../../../../components/LoadingButton';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import useSessionTimer from '../../../../hooks/useSessionTime';
import { useAuth } from '../../../../hooks/useAuth';
import Lockr from 'lockr';

dayjs.extend(duration);

const SessionReminderModal = () => {
  const { t } = useI18n();
  const { activeModal, disableModal, enableModal } = useModal();
  const { user } = useAuth();
  const acceptanceCount = (Lockr.get(
    LocalStorageKeys.sessionAcceptanceCounter,
  ) || 1) as number;
  const acceptanceDuration = acceptanceCount * 30;
  const sessionReminderTime =
    acceptanceDuration || ComponentSettings?.sessionReminderTime || 30;
  const diff = useSessionTimer();
  const reminder = Math.floor(diff?.asMinutes() as number);

  const hideModal = () => {
    Lockr.set(
      LocalStorageKeys.sessionAcceptanceCounter,
      acceptanceCount + 1 || 1,
    );
    disableModal(ComponentName.SessionReminderModal);
  };

  useEffect(() => {
    if (reminder >= sessionReminderTime) {
      enableModal(ComponentName.SessionReminderModal);
    }
    return () => {
      if (!user.logged_in && acceptanceDuration > reminder) {
        Lockr.rm(LocalStorageKeys.sessionAcceptanceCounter);
      }
    };
  }, [diff]);

  if (!(activeModal === ComponentName.SessionReminderModal) || !user.logged_in)
    return null;

  return (
    <GenericModal
      isCentered
      isStatic
      withoutClose={true}
      show
      hideCallback={() => hideModal()}
      className="pb-5"
    >
      <h2 className="mb-2 modal-title">{t('session_reminder_modal_title')}</h2>
      <p className="mb-3">
        {`${t('session_reminder_modal_text')} ${acceptanceDuration} ${t(
          'minutes',
        )}`}
      </p>
      <div className="d-flex justify-content-center">
        <LoadingButton
          variant="primary"
          className="mr-2"
          onClick={() => hideModal()}
        >
          {t('session_reminder_modal_btn')}
        </LoadingButton>
      </div>
    </GenericModal>
  );
};

export default SessionReminderModal;
