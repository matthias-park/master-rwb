import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ComponentName,
  FormFieldValidation,
  PagesName,
  VALIDATIONS,
} from '../constants';
import { useI18n } from '../hooks/useI18n';
import CustomAlert from './bnl/components/CustomAlert';
import Form from 'react-bootstrap/Form';
import { useRoutePath } from '../hooks/index';
import useGTM from '../hooks/useGTM';
import LoadingButton from '../components/LoadingButton';
import Link from '../components/Link';
import TextInput from '../components/customFormInputs/TextInput';
import { useAuth } from '../hooks/useAuth';
import { useConfig } from '../hooks/useConfig';
import { useModal } from '../hooks/useModal';
import Button from 'react-bootstrap/Button';

const LoginForm = () => {
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const loginId = window.__config__.componentSettings?.login?.emailLogin
    ? 'email'
    : 'username';
  const [pinRequired, setPinRequired] = useState(false);
  const formMethods = useForm<{
    username: string;
    email: string;
    password: string;
    pin: string;
  }>({
    mode: 'all',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });
  const { handleSubmit, formState, watch, reset } = formMethods;
  const watchAllFields = watch();
  const { signin } = useAuth();
  const sendDataToGTM = useGTM();
  const { cookies } = useConfig();
  const { enableModal } = useModal();
  const forgotPasswordRoute = useRoutePath(PagesName.ForgotPasswordPage);
  const cancelTwoFactorAuth = () => {
    reset();
    setPinRequired(false);
  };
  const onSubmit = async ({ username, email, password, pin }) => {
    if (
      window.__config__.componentSettings?.login?.loginCookiesAccept &&
      !cookies.cookies.accepted
    ) {
      enableModal(ComponentName.CookiesModal);
    } else {
      setApiError(null);
      sendDataToGTM({
        event: 'LoginSubmitted',
      });
      const response = await signin(username || email, password, pin);
      if (response.twoFactorAuthRequired) {
        setPinRequired(true);
      }
      if (!response.success) {
        return setApiError(response.message || t('login_failed_to_login'));
      }
      return;
    }
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
        {pinRequired ? (
          <TextInput
            rules={{
              required: t('login_pin_required'),
            }}
            validation={apiError ? FormFieldValidation.Invalid : undefined}
            id="pin"
            type="text"
            title={t('login_pin')}
            maskedInput={{
              format: '####',
              mask: '_',
              allowEmptyFormatting: true,
            }}
            autoComplete="one-time-code"
          />
        ) : (
          <>
            <TextInput
              rules={{
                required: t('login_field_required'),
                validate:
                  loginId === 'email'
                    ? (value: string) =>
                        VALIDATIONS.email(value) ||
                        t('login_form_bad_email_format')
                    : undefined,
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
            />
            <div className="d-flex align-items-center flex-wrap">
              <Link
                to={forgotPasswordRoute}
                className="text-14 ml-auto login-dropdown__menu-link"
              >
                <u>{t('login_forgot_password')}</u>
              </Link>
            </div>
          </>
        )}
        <LoadingButton
          disabled={
            !formState.isDirty ||
            !watchAllFields[loginId] ||
            !watchAllFields.password ||
            !!formState.errors[loginId]?.message
          }
          className="btn btn-primary d-block mx-auto mt-4 px-5"
          type="submit"
          loading={formState.isSubmitting}
        >
          {t('login_submit')}
        </LoadingButton>
        {pinRequired && (
          <Button
            className="btn btn-primary d-block mx-auto mt-4 px-5"
            onClick={cancelTwoFactorAuth}
          >
            {t('login_cancel')}
          </Button>
        )}
      </Form>
    </FormProvider>
  );
};

export default LoginForm;
