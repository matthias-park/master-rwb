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

const ForgotPasswordPage = () => {
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const getToken = useCaptcha();
  const { handleSubmit, formState } = formMethods;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { t } = useI18n();
  const { user } = useAuth();
  const sendDataToGTM = useGTM();

  useEffect(() => {
    sendDataToGTM({
      event: 'ForgottenPassword',
    });
  }, []);

  if (user.logged_in) {
    return <Redirect to="/" />;
  }

  const onSubmit = async ({ email }) => {
    sendDataToGTM({
      event: 'LoginPasswordFormSubmit',
    });
    const captchaToken = await getToken?.('forgot_password').catch(() => '');
    let form: { [key: string]: string } = { email };
    if (captchaToken) form.captcha_token = captchaToken;
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
        <p className="text-14 mb-3">{t('forgot_password_text')}</p>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              rules={{
                required: t('forgot_password_field_required'),
                validate: async value =>
                  VALIDATIONS.email(value) || t('register_email_bad_format'),
              }}
              id="email"
              title={t('forgot_password_email_field')}
            />
            <LoadingButton
              variant="primary"
              disabled={!!formState.errors.email}
              loading={formState.isSubmitting}
              type="submit"
              data-testid="button"
              className="mt-3"
            >
              {t('forgot_password_submit_btn')}
            </LoadingButton>
          </Form>
        </FormProvider>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
