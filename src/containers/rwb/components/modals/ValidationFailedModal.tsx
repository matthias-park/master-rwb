import React, { useEffect } from 'react';
import GenericModal from './GenericModal';
import { useI18n } from '../../../../hooks/useI18n';
import { KYC_VALIDATOR_STATUS } from '../../../../types/UserStatus';
import { useModal } from '../../../../hooks/useModal';
import { ComponentName, RailsApiResponseFallback } from '../../../../constants';
import { useAuth } from '../../../../hooks/useAuth';
import { useRoutePath } from '../../../../hooks';
import { PagesName } from '../../../../constants';
import Link from '../../../../components/Link';
import useApi from '../../../../hooks/useApi';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import KycAttempts from '../../../../types/api/user/KycAttempts';
import clsx from 'clsx';
import LoadingSpinner from '../../../../components/LoadingSpinner';

const ValidationFailedModal = () => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const personalInfoRoute = useRoutePath(PagesName.PersonalInfoPage);
  const RequiredDocumentsRoute = useRoutePath(PagesName.RequiredDocuments);
  const {
    activeModal,
    allActiveModals,
    enableModal,
    disableModal,
  } = useModal();
  const modalActive = activeModal === ComponentName.ValidationFailedModal;
  const validatorNotOk = [
    KYC_VALIDATOR_STATUS.CanPlayAndShouldUpdatePersonalData,
    KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataOnly,
    KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataLimitedAttempts,
    KYC_VALIDATOR_STATUS.ShouldUploadDocumentForKyc,
    KYC_VALIDATOR_STATUS.ForceDocument,
  ].includes(user.validator_status || 0);
  const { data, mutate } = useApi<RailsApiResponse<KycAttempts | null>>(
    user.logged_in && validatorNotOk ? '/restapi/v1/user/kyc_attempts' : null,
  );

  useEffect(() => {
    if (validatorNotOk) {
      enableModal(ComponentName.ValidationFailedModal);
      if (data?.Success) mutate(RailsApiResponseFallback, true);
    } else if (
      !user.logged_in &&
      allActiveModals.includes(ComponentName.ValidationFailedModal)
    ) {
      disableModal(ComponentName.ValidationFailedModal);
      mutate(RailsApiResponseFallback, false);
    }
  }, [user.validator_status]);

  const hideModal = () => disableModal(ComponentName.ValidationFailedModal);

  if (!modalActive) return null;
  const { attempts, max_attempts } = data?.Data || {};
  const allowBtnValidator = (
    status: KYC_VALIDATOR_STATUS | undefined,
    editInfo: boolean,
  ): boolean => {
    // editInfo => To distinguish between personInfoBtn and DocumentUploadBtn.
    // If the status's value allows to edit a personal info, such as 5, the editInfo value will be true. Otherwise, it's false.

    const isValidEdit =
      attempts != null && max_attempts != null && attempts < max_attempts;
    const isValidUpload =
      attempts != null && max_attempts != null && attempts >= max_attempts;

    switch (status) {
      case KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataLimitedAttempts: {
        return editInfo && isValidEdit;
      }
      case KYC_VALIDATOR_STATUS.ShouldUploadDocumentForKyc: {
        return !editInfo && isValidUpload;
      }
      case KYC_VALIDATOR_STATUS.ForceDocument: {
        return !editInfo;
      }
      default: {
        return false;
      }
    }
  };
  return (
    <GenericModal
      show
      hideCallback={hideModal}
      isCentered={true}
      isStatic={true}
      className="p-4"
    >
      <div className="p-sm-2">
        <h2 className="mb-2 mt-1">{jsxT('validation_failed_title')}</h2>
        <p>{jsxT(`validation_failed_body_${user.validator_status}`)}</p>
        <div className="d-flex flex-column flex-sm-row">
          <Link
            to={personalInfoRoute}
            onClick={hideModal}
            className={clsx(
              'btn btn-primary mt-3 mt-sm-4 px-4',
              !allowBtnValidator(user.validator_status, true) && 'disabled',
            )}
          >
            {t('validation_failed_profile_link')}{' '}
            {attempts != null ? (
              `${attempts}/${max_attempts}`
            ) : (
              <LoadingSpinner small show className="ml-2" />
            )}
          </Link>
          <Link
            to={RequiredDocumentsRoute}
            onClick={hideModal}
            className={clsx(
              'btn btn-primary mt-2 mt-sm-4 px-4 ml-sm-1',
              !allowBtnValidator(user.validator_status, false) && 'disabled',
            )}
          >
            {t('validation_failed_documents_link')}
          </Link>
        </div>
      </div>
    </GenericModal>
  );
};

export default ValidationFailedModal;
