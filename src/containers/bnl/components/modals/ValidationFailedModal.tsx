import React, { useEffect } from 'react';
import GenericModal from './GenericModal';
import { useI18n } from '../../../../hooks/useI18n';
import { VALIDATOR_STATUS } from '../../../../types/UserStatus';
import { useModal } from '../../../../hooks/useModal';
import { ComponentName } from '../../../../constants';
import { useAuth } from '../../../../hooks/useAuth';
import { useRoutePath } from '../../../../hooks';
import { PagesName } from '../../../../constants';
import Link from '../../../../components/Link';

const ValidationFailedModal = () => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const personalInfoRoute = useRoutePath(PagesName.PersonalInfoPage);
  const {
    activeModal,
    allActiveModals,
    enableModal,
    disableModal,
  } = useModal();

  const hideModal = () => disableModal(ComponentName.ValidationFailedModal);

  useEffect(() => {
    if (
      [VALIDATOR_STATUS.MINOR_ERROR, VALIDATOR_STATUS.MAJOR_ERROR].includes(
        user.validator_status || 0,
      )
    ) {
      enableModal(ComponentName.ValidationFailedModal);
    } else if (
      !user.logged_in &&
      allActiveModals.includes(ComponentName.ValidationFailedModal)
    ) {
      hideModal();
    }
  }, [user.validator_status]);

  const showModal =
    activeModal === ComponentName.ValidationFailedModal &&
    !!user.validator_status;

  const validationFailedBody =
    showModal && jsxT(`validation_failed_body_${user.validator_status}`);
  return (
    <GenericModal
      key={user.validator_status}
      show={showModal}
      hideCallback={hideModal}
      isCentered={true}
      isStatic={true}
      className="text-center pb-5"
    >
      <h2 className="mb-3 mt-4">{jsxT('validation_failed_title')}</h2>
      <p>{validationFailedBody}</p>
      <Link
        to={personalInfoRoute}
        onClick={hideModal}
        className="btn btn-primary mx-auto mt-4 px-4"
      >
        {t('validation_failed_profile_link')}
      </Link>
    </GenericModal>
  );
};

export default ValidationFailedModal;
