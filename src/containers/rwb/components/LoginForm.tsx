import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ComponentName,
  ComponentSettings,
  FormFieldValidation,
  PagesName,
  VALIDATIONS,
} from '../../../constants';
import { useI18n } from '../../../hooks/useI18n';
import CustomAlert from './CustomAlert';
import Form from 'react-bootstrap/Form';
import { useRoutePath } from '../../../hooks/index';
import useGTM from '../../../hooks/useGTM';
import LoadingButton from '../../../components/LoadingButton';
import Link from '../../../components/Link';
import TextInput from '../../../components/customFormInputs/TextInput';
import { useAuth } from '../../../hooks/useAuth';
import { useConfig } from '../../../hooks/useConfig';
import { useModal } from '../../../hooks/useModal';
import Button from 'react-bootstrap/Button';
import useCountdownTicker from '../../../hooks/useCountdownTicker';
import { useHistory, useLocation } from 'react-router-dom';

const LoginForm = () => {
  const { t } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const loginId = ComponentSettings?.login?.emailLogin ? 'email' : 'username';
  const [pinRequired, setPinRequired] = useState(false);
  const formMethods = useForm<{
    username: string;
    email: string;
    password: string;
    pin: string | null;
  }>({
    mode: 'all',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });
  const { handleSubmit, formState, watch, reset, setValue } = formMethods;
  const watchAllFields = watch();
  const { signin } = useAuth();
  const sendDataToGTM = useGTM();
  const { cookies } = useConfig();
  const { enableModal } = useModal();
  const contactUsRoute = useRoutePath(PagesName.ContactUsPage, true);
  const forgotPasswordRoute = useRoutePath(PagesName.ForgotPasswordPage);
  const cancelTwoFactorAuth = () => {
    reset();
    setPinRequired(false);
  };
  const [getNewPin, setGetNewPin] = useState(false);
  const { countdownTime, showCountdown, startCountDown } = useCountdownTicker(
    120,
  );
  const history = useHistory();
  const regActivationPage = useRoutePath(PagesName.RegisterActivationPage);
  const location = useLocation<{
    from?: string;
    protectedRoute?: boolean;
  } | null>();
  const message = new URLSearchParams(location.search).get('message');

  const onSubmit = async ({ username, email, password, pin }) => {
    if (ComponentSettings?.login?.loginCookiesAccept && !cookies.accepted) {
      enableModal(ComponentName.CookiesModal);
    } else {
      setApiError(null);
      !getNewPin &&
        sendDataToGTM({
          event: 'LoginSubmitted',
        });
      const response = await signin(username || email, password, pin);
      if (response.userActivationNeeded) {
        history.push(regActivationPage);
      }
      if (response.twoFactorAuthRequired) {
        setPinRequired(true);
        setGetNewPin(false);
      }
      if (!response.success) {
        return setApiError(response.message || t('login_failed_to_login'));
      }
      return;
    }
  };

  const sendNewPin = () => {
    setGetNewPin(true);
    setValue('pin', null);
    handleSubmit(onSubmit)();
    startCountDown();
  };

  return (
    <FormProvider {...formMethods}>
      <Form
        className="mb-4 login-dropdown__menu-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CustomAlert
          show={formState.isSubmitted && !!apiError}
          variant="danger"
        >
          <div dangerouslySetInnerHTML={{ __html: apiError || '' }} />
        </CustomAlert>
        {pinRequired && (
          <p className="mb-3">
            {showCountdown && (
              <span>
                {t('countdown_new_pin')} {countdownTime}
              </span>
            )}
            {!showCountdown && (
              <span onClick={sendNewPin}> {t('send_login_pin_again')}</span>
            )}
          </p>
        )}
        {pinRequired ? (
          <TextInput
            rules={{
              required: getNewPin ? false : t('login_pin_required'),
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
            <div className="d-flex align-items-center justify-content-center flex-wrap">
              {location.state?.protectedRoute ||
                (message && (
                  <p className="my-3 login-dropdown__menu-link">
                    {t(message || 'login_protected_route')}
                  </p>
                ))}
            </div>
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
              disableCheckMark
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
          className="btn btn-primary d-block mx-auto mt-5 mb-3 px-5"
          type="submit"
          loading={formState.isSubmitting && !getNewPin}
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

        <div className="login-dropdown__menu-form__contact-us">
          <span className="login-dropdown__menu-form__contact-us__body">
            {t('verification_contact_us_text')}
          </span>
          <span
            className="login-dropdown__menu-form__contact-us__btn"
            onClick={() => history.push(contactUsRoute)}
          >
            {t('verification_contact_us_btn')}
          </span>
        </div>
        <div className="login-dropdown__menu-form__info">
          <img
            className="login-dropdown__menu-form__info__img"
            alt="responsible-gaming"
            src={`/assets/images/footer/responsible-gaming.png`}
          />
          <span className="login-dropdown__menu-form__info__text">
            {t('verification_info_text')}
          </span>
        </div>
      </Form>
    </FormProvider>
  );
};

export default LoginForm;
