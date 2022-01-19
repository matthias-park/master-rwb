import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import TextInput from '../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../components/LoadingButton';
import CustomAlert from './CustomAlert';
import { useI18n } from '../../../hooks/useI18n';
import useGTM from '../../../hooks/useGTM';
import { useAuth } from '../../../hooks/useAuth';
import { useModal } from '../../../hooks/useModal';
import {
  ComponentName,
  FormFieldValidation,
  VALIDATIONS,
} from '../../../constants';

function LoginForm() {
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const loginId = window.__config__.componentSettings?.login?.emailLogin
    ? 'email'
    : 'username';
  const formMethods = useForm<{
    username: string;
    email: string;
    password: string;
    pin: string;
    selectionas: string;
  }>({
    mode: 'all',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });
  const { handleSubmit, formState, watch } = formMethods;
  const watchAllFields = watch();
  const { user, signin } = useAuth();
  const sendDataToGTM = useGTM();
  const { enableModal, disableModal } = useModal();

  useEffect(() => {
    user.logged_in &&
      user.id &&
      window.__config__.componentSettings?.limitsOnAction?.includes('login') &&
      enableModal(ComponentName.LimitsModal);
  }, [user]);

  const onSubmit = async ({ username, email, password }) => {
    setApiError(null);
    sendDataToGTM({
      event: 'LoginSubmitted',
    });
    const response = await signin(username || email, password);
    if (response.userActivationNeeded) {
      disableModal(ComponentName.LoginModal);
      return enableModal(ComponentName.ActivateUserModal);
    } else if (!response.success) {
      return setApiError(response.message || t('login_failed_to_login'));
    } else {
      disableModal(ComponentName.LoginModal);
    }
    if (response.total_deposit_count === 0) {
      enableModal(ComponentName.DepositLinkModal);
    }
    return;
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <CustomAlert
          show={formState.isSubmitted && !!apiError}
          variant="danger"
        >
          <div dangerouslySetInnerHTML={{ __html: apiError || '' }} />
        </CustomAlert>
        <TextInput
          rules={{
            required: t('login_field_required'),
            validate: (value: string) =>
              VALIDATIONS.email(value) || t('login_form_bad_email_format'),
          }}
          id={loginId}
          type="text"
          title={t(`login_${loginId}`)}
          autoComplete={loginId}
          validation={apiError ? FormFieldValidation.Invalid : undefined}
        />
        <TextInput
          rules={{
            required: t('login_password_required'),
          }}
          validation={apiError ? FormFieldValidation.Invalid : undefined}
          id="password"
          type="password"
          title={t('login_password')}
          autoComplete="current-password"
          toggleVisibility
          disableCheckMark
        />
        <small className="modal-body__forgot-pw">
          {t('login_forgot_password')}
          <p
            className="modal-link ml-sm"
            onClick={() => {
              disableModal(ComponentName.LoginModal);
              enableModal(ComponentName.ForgotPasswordModal);
            }}
          >
            {t('login_forgot_password_link')}
          </p>
        </small>
        <LoadingButton
          disabled={
            !formState.isDirty ||
            !watchAllFields[loginId] ||
            !watchAllFields.password ||
            !!formState.errors[loginId]?.message
          }
          className="btn btn-primary mt-3 w-100 rounded-pill"
          type="submit"
          loading={formState.isSubmitting}
        >
          {t('login_submit')}
        </LoadingButton>
      </Form>
    </FormProvider>
  );
}

export default LoginForm;
