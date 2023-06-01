import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '../../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../../components/LoadingButton';
import { ComponentName, VALIDATIONS } from '../../../../constants';
import useGTM from '../../../../hooks/useGTM';
import { useI18n } from '../../../../hooks/useI18n';
import { useModal } from '../../../../hooks/useModal';
import GenericModalHeader from './GenericModalHeader';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useParams, useHistory } from 'react-router-dom';
import { postApi } from '../../../../utils/apiUtils';
import ForgotPasswordResponse from '../../../../types/api/user/ForgotPassword';
import CustomAlert from '../CustomAlert';
import { enableModal } from '../../../../state/reducers/modals';

const ResetPasswordModal = () => {
  const { t } = useI18n();
  const { activeModal, disableModal } = useModal();
  const history = useHistory();
  const sendDataToGTM = useGTM();
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const { handleSubmit, formState, watch, trigger, reset } = formMethods;
  const { code } = useParams<{ code: string }>();

  const closeModal = () => {
    disableModal(ComponentName.ResetPasswordModal);
    history.push('/');
  };

  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const onSubmit = async ({ password }) => {
    setApiResponse(null);

    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      `/restapi/v1/user/login/set_password`,
      {
        new_password: password,
        reset_code: code!,
      },
    ).catch((res: RailsApiResponse<null>) => {
      return res;
    });
    if (result.Success) {
      sendDataToGTM({
        event: 'LoginPasswordChange',
      });
      reset();
    }

    return setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
  };

  return (
    <Modal
      show={activeModal === ComponentName.ResetPasswordModal}
      onHide={closeModal}
      centered
      dialogClassName="reset-password-modal"
    >
      <GenericModalHeader title={t('new_password')} handleClose={closeModal} />
      <Modal.Body>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CustomAlert
              show={!!apiResponse}
              variant={apiResponse?.success ? 'success' : 'danger'}
            >
              <div>{apiResponse?.msg}</div>
            </CustomAlert>

            <TextInput
              disableCopyPaste
              disabled={apiResponse?.success}
              rules={{
                required: `${t('reset_password_field')} ${t(
                  'reset_password_field_required',
                )}`,
                validate: value =>
                  VALIDATIONS.password(value) || t('register_password_weak'),
              }}
              onBlur={() =>
                watch('repeat_password') && trigger('repeat_password')
              }
              id="password"
              autoComplete="new-password"
              type="password"
              title={t('reset_password_field')}
              toggleVisibility
            />
            <TextInput
              disableCopyPaste
              disabled={apiResponse?.success}
              rules={{
                required: `${t('reset_password_field')} ${t(
                  'reset_password_field_required',
                )}`,
                validate: value =>
                  value === watch('password') ||
                  t('reset_password_need_match_password'),
              }}
              id="repeat_password"
              autoComplete="new-password"
              type="password"
              title={t('reset_password_repeat_field')}
              toggleVisibility
            />

            {apiResponse?.success ? (
              <Button
                variant="primary"
                data-testid="button"
                className="rounded-pill w-100"
                onClick={closeModal}
              >
                {t('disable_button')}
              </Button>
            ) : (
              <LoadingButton
                variant="primary"
                disabled={!watch('password') || !watch('repeat_password')}
                loading={formState.isSubmitting}
                type="submit"
                data-testid="button"
                className="rounded-pill w-100 mt-4"
              >
                {t('forgot_password_submit_btn')}
              </LoadingButton>
            )}
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <div
          className="text-primary"
          onClick={() => {
            closeModal();
            enableModal(ComponentName.ResendEmailModal);
          }}
        >
          {t('resend_new_pwd_code')}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ResetPasswordModal;
