import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { postApi } from '../../../../utils/apiUtils';
import ForgotPasswordResponse from '../../../../types/api/user/ForgotPassword';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '../../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../../components/LoadingButton';
import { ComponentName, PagesName, VALIDATIONS } from '../../../../constants';
import { useI18n } from '../../../../hooks/useI18n';
import { useModal } from '../../../../hooks/useModal';
import GenericModalHeader from './GenericModalHeader';
import useGTM from '../../../../hooks/useGTM';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useRoutePath } from '../../../../hooks';
import { Link } from 'react-router-dom';

const ForgotPasswordModal = () => {
  const { activeModal, disableModal, enableModal } = useModal();
  const faqPath = useRoutePath(PagesName.FaqPage);
  const closeModal = () => disableModal(ComponentName.ForgotPasswordModal);
  const sendDataToGTM = useGTM();

  const formMethods = useForm({
    mode: 'onBlur',
  });

  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);

  const { handleSubmit, formState } = formMethods;
  const { t } = useI18n();

  const onSubmit = async ({ email }) => {
    setApiResponse(null);
    sendDataToGTM({
      event: 'LoginPasswordFormSubmit',
    });
    let form: { [key: string]: string } = { email };
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      '/restapi/v1/user/login/forgot_password',
      form,
    ).catch((res: RailsApiResponse<null>) => res);
    return setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
  };

  return (
    <Modal
      show={activeModal === ComponentName.ForgotPasswordModal}
      centered
      dialogClassName="forgot-password-modal"
      onShow={() => setApiResponse(null)}
    >
      <GenericModalHeader
        title={
          !apiResponse?.success
            ? t('forgot_password_page_title')
            : t('email_sent')
        }
        handleClose={closeModal}
      />
      <Modal.Body>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {!apiResponse?.success ? (
              <>
                <TextInput
                  rules={{
                    required: t('forgot_password_field_required'),
                    validate: async value =>
                      VALIDATIONS.email(value) ||
                      t('register_email_bad_format'),
                  }}
                  id="email"
                  title={t('forgot_password_email_field')}
                />
              </>
            ) : (
              <p>{t('forgot_password_note')}</p>
            )}
            <LoadingButton
              variant="primary"
              onClick={() => {
                if (apiResponse?.success) {
                  closeModal();
                  enableModal(ComponentName.ResetPasswordModal);
                }
              }}
              type={!apiResponse?.success ? 'submit' : 'button'}
              disabled={!!formState.errors.email || !formState.isDirty}
              loading={formState.isSubmitting}
              data-testid="button"
              className="btn btn-primary mt-3 w-100 rounded-pill"
            >
              {!apiResponse?.success ? t('submit') : t('disable_button')}
            </LoadingButton>
          </Form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <span>{t('need_help')}</span>
        <Link
          className="modal-link"
          to={faqPath}
          onClick={() => {
            closeModal();
          }}
        >
          {t('click_here')}
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default ForgotPasswordModal;
