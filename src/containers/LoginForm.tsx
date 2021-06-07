import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormFieldValidation, PagesName, VALIDATIONS } from '../constants';
import { useI18n } from '../hooks/useI18n';
import CustomAlert from './bnl/components/CustomAlert';
import { OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { useRoutePath } from '../hooks/index';
import useGTM from '../hooks/useGTM';
import LoadingButton from '../components/LoadingButton';
import Link from '../components/Link';
import TextInput from '../components/customFormInputs/TextInput';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const formMethods = useForm<{
    email: string;
    password: string;
    remember_me: boolean;
  }>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { handleSubmit, formState, watch } = formMethods;
  const watchAllFields = watch();
  const { signin } = useAuth();
  const sendDataToGTM = useGTM();
  const forgotPasswordRoute = useRoutePath(PagesName.ForgotPasswordPage);
  const onSubmit = async ({ email, password, remember_me }) => {
    setApiError(null);
    sendDataToGTM({
      event: 'LoginSubmitted',
    });
    const response = await signin(email, password, remember_me);
    if (!response.success) {
      return setApiError(response.message || t('login_failed_to_login'));
    }
    return;
  };
  return (
    <FormProvider {...formMethods}>
      <Form
        className="pb-4 mb-4 login-dropdown__menu-form"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          id="email"
          type="email"
          title={t('login_email')}
          autoComplete="email"
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
        />
        <div className="d-flex align-items-center flex-wrap">
          <Link
            to={forgotPasswordRoute}
            className="text-14 ml-auto login-dropdown__menu-link"
          >
            <u>{t('login_forgot_password')}</u>
          </Link>
        </div>
        <LoadingButton
          disabled={
            !formState.isDirty ||
            !watchAllFields.email ||
            !watchAllFields.password ||
            !!formState.errors.email?.message
          }
          className="btn btn-primary d-block mx-auto mt-4 px-5"
          type="submit"
          loading={formState.isSubmitting}
        >
          {t('login_submit')}
        </LoadingButton>
      </Form>
    </FormProvider>
  );
};

export default LoginForm;
