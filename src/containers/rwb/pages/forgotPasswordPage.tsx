import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { postApi } from '../../../utils/apiUtils';
import ForgotPasswordResponse from '../../../types/api/user/ForgotPassword';
import CustomAlert from '../components/CustomAlert';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';
import LoadingButton from '../../../components/LoadingButton';
import { VALIDATIONS } from '../../../constants';
import TextInput from '../../../components/customFormInputs/TextInput';
import { useAuth } from '../../../hooks/useAuth';
import { useCaptcha } from '../../../hooks/useGoogleRecaptcha';
import { Button } from 'react-bootstrap';

const ForgotPasswordPage = () => {
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const getToken = useCaptcha();
  const { handleSubmit, watch, trigger, reset } = formMethods;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { t } = useI18n();
  const { user } = useAuth();
  const sendDataToGTM = useGTM();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sendDataToGTM({
      event: 'ForgottenPassword',
    });
  }, []);

  if (user.logged_in) {
    return <Redirect to="/" />;
  }

  const onSubmit = async ({ password, reset_code, email }) => {
    if (step === 1) {
      getResetCode(email);
    }
    if (step === 2) {
      setStep(prev => prev + 1);
    }
    if (step === 3) {
      setPassword(password, reset_code, email);
    }
  };

  const getResetCode = async email => {
    setIsLoading(true);
    sendDataToGTM({
      event: 'LoginPasswordFormSubmit',
    });
    const captchaToken = await getToken?.('forgot_password').catch(() => '');
    let form: { [key: string]: string } = { email };
    if (captchaToken) form.captcha_token = captchaToken;
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      '/restapi/v2/user/login/forgot_password',
      form,
    ).catch((res: RailsApiResponse<null>) => res);
    setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
    if (result.Success) {
      setStep(prev => prev + 1);
    }
    setIsLoading(false);
  };

  const setPassword = async (password, reset_code, email) => {
    setIsLoading(true);
    setApiResponse(null);
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      `/restapi/v2/user/login/set_password`,
      {
        new_password: password,
        reset_code: reset_code,
        email: email,
      },
    ).catch((res: RailsApiResponse<null>) => res);
    if (result.Success) {
      sendDataToGTM({
        event: 'LoginPasswordChange',
      });
    }
    setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
    reset();
    setStep(1);
    setIsLoading(false);
  };

  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h2 className="page-inner__title mb-4">
          {t('forgot_password_page_title')}
        </h2>
        <CustomAlert
          show={!!apiResponse}
          variant={
            (apiResponse && (apiResponse.success ? 'success' : 'danger')) || ''
          }
        >
          {apiResponse?.msg}
        </CustomAlert>
        {step <= 3 && (
          <p className="text-14 mb-3">
            {t(`forgot_password_step_${step}_text`)}
          </p>
        )}
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
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
                <LoadingButton
                  variant="primary"
                  className="mt-3"
                  disabled={!watch('email')}
                  loading={isLoading}
                  type="submit"
                >
                  {t('forgot_password_next_btn')}
                </LoadingButton>
              </>
            )}
            {step === 2 && (
              <>
                <TextInput
                  rules={{
                    required: t('reset_code_field_required'),
                  }}
                  id="reset_code"
                  title={t('forgot_password_reset_code_field')}
                />
                <Button
                  variant="primary"
                  className="mt-3"
                  disabled={!watch('reset_code')}
                  type={'submit'}
                >
                  {t('forgot_password_next_btn')}
                </Button>
              </>
            )}
            {step === 3 && (
              <>
                <TextInput
                  disableCopyPaste
                  rules={{
                    required: `${t('reset_password_field')} ${t(
                      'reset_password_field_required',
                    )}`,
                    validate: value =>
                      VALIDATIONS.password(value) ||
                      t('register_password_weak'),
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
                  rules={{
                    required: `${t('reset_password_field')} ${t(
                      'reset_password_field_required',
                    )}`,
                    validate: value =>
                      (value === watch('password') &&
                        VALIDATIONS.password(value)) ||
                      t('reset_password_need_match_password'),
                  }}
                  id="repeat_password"
                  autoComplete="new-password"
                  type="password"
                  title={t('reset_password_repeat_field')}
                  toggleVisibility
                />
                <LoadingButton
                  variant="primary"
                  disabled={!watch('password') || !watch('repeat_password')}
                  loading={isLoading}
                  type="submit"
                  data-testid="button"
                  className="mt-3"
                >
                  {t('forgot_password_submit_btn')}
                </LoadingButton>
              </>
            )}
          </Form>
        </FormProvider>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
