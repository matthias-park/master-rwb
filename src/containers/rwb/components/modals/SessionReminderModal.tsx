import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../../src/hooks/useAuth';
import { useI18n } from '../../../../hooks/useI18n';
import { ComponentName, ComponentSettings } from '../../../../constants';
import GenericModal from './GenericModal';
import { useModal } from '../../../../hooks/useModal';
import LoadingButton from '../../../../components/LoadingButton';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const SessionReminderModal = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const {
    activeModal,
    disableModal,
    enableModal,
    allActiveModals,
  } = useModal();
  const hideModal = () => disableModal(ComponentName.SessionReminderModal);
  const intervalRef = useRef<number | null>(null);
  const [reminder, setReminder] = useState<number>(0);
  const [sessionDetails] = useLocalStorage<null | Dayjs>(
    'session_details',
    null,
  );
  const sessionReminderConfig = ComponentSettings?.sessionReminderTime || 30;

  const backupSessionTimer = dayjs();
  useEffect(() => {
    const updateTimer = () => {
      const timeDuration = Math.floor(
        dayjs
          .duration(dayjs().diff(sessionDetails || backupSessionTimer))
          .asMinutes(),
      );
      reminder < timeDuration && setReminder(timeDuration);
    };
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 60000);
    return () => clearInterval(intervalRef.current as number);
  }, [sessionDetails]);

  useEffect(() => {
    if (
      user.logged_in &&
      reminder !== 0 &&
      reminder % sessionReminderConfig === 0 &&
      !allActiveModals.includes(ComponentName.SessionReminderModal)
    ) {
      enableModal(ComponentName.SessionReminderModal);
    }
  }, [user.logged_in, reminder]);

  if (!(activeModal === ComponentName.SessionReminderModal) || !user.logged_in)
    return null;
  return (
    <GenericModal
      isCentered
      isStatic
      withoutClose={false}
      show
      hideCallback={() => hideModal()}
      className="pb-5"
    >
      <h2 className="mb-2 modal-title">{t('session_reminder_modal_title')}</h2>
      <p className="mb-3">
        {`${t('session_reminder_modal_text')} ${reminder} ${t('minutes')}`}
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
