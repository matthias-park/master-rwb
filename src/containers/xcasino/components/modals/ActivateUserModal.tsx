import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../../components/LoadingButton';
import { ComponentName, RailsApiResponseFallback } from '../../../../constants';
import { useAuth } from '../../../../hooks/useAuth';
import { useI18n } from '../../../../hooks/useI18n';
import { useModal } from '../../../../hooks/useModal';
import { RootState } from '../../../../state';
import { setUserActivated } from '../../../../state/reducers/user';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { NET_USER } from '../../../../types/UserStatus';
import { postApi } from '../../../../utils/apiUtils';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import CustomAlert from '../CustomAlert';
import GenericModalHeader from './GenericModalHeader';

const ActivateUserModal = () => {
  const { enableModal, disableModal } = useModal();
  const { t } = useI18n();
  const { signout, updateUser } = useAuth();
  const dispatch = useDispatch();
  const registration_id = useSelector(
    (state: RootState) => state.user.registration_id,
  );
  const formMethods = useForm<{
    activation_code: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      activation_code: '',
    },
  });
  const { handleSubmit, formState, watch } = formMethods;
  const [apiError, setApiError] = useState<string | null>(null);
  const activationCodeEmpty = !!watch('activation_code');
  const closeModal = () => {
    disableModal(ComponentName.ActivateUserModal);
    signout();
  };
  const onSubmit = async ({ activation_code }) => {
    setApiError(null);
    const response = await postApi<RailsApiResponse<NET_USER>>(
      '/restapi/v1/registration/activate',
      {
        registration_id,
        activation_code,
      },
    ).catch(() => RailsApiResponseFallback);
    if (response.Success) {
      dispatch(setUserActivated());
      updateUser(true);
      disableModal(ComponentName.ActivateUserModal);
    } else {
      setApiError(response.Message || t('api_response_failed'));
    }
    return response;
  };

  return (
    <Modal
      show
      onHide={closeModal}
      centered
      dialogClassName="activate-user-modal"
    >
      <GenericModalHeader
        title={t('activate_user_title')}
        handleClose={closeModal}
      />

      <Modal.Body>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {!!apiError && (
              <CustomAlert show variant="danger">
                {replaceStringTagsReact(apiError)}
              </CustomAlert>
            )}
            <TextInput
              type="text"
              id="activation_code"
              rules={{
                required: true,
              }}
              title={t('activate_user_code')}
            />
            <LoadingButton
              type="submit"
              className="btn btn-primary mt-3 w-100 rounded-pill"
              disabled={!formState.isValid || !activationCodeEmpty}
              loading={formState.isSubmitting}
            >
              {t('activate_user_btn')}
            </LoadingButton>
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer className="last-slide fade-in">
        <p>
          {t('resend_activation_code')}
          <p
            className="modal-link"
            onClick={() => {
              enableModal(ComponentName.ResendEmailModal);
            }}
          >
            {t('click_here')}
          </p>
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default ActivateUserModal;
