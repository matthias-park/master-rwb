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
import TextInput from '../../../components/customFormInputs/TextInput';
import { useAuth } from '../../../hooks/useAuth';

const ForgotLoginPage = () => {
  const formMethods = useForm({
    mode: 'onBlur',
  });
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
      event: 'LoginUsernameFormSubmit',
    });
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      '/railsapi/v1/user/login/forgot_login',
      {
        email,
      },
    ).catch((res: RailsApiResponse<null>) => res);
    return setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
  };
  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h2 className="mb-4">{t('forgot_login_page_title')}</h2>
        <CustomAlert
          show={!!apiResponse}
          variant={
            (apiResponse && (apiResponse.success ? 'success' : 'danger')) || ''
          }
        >
          {apiResponse?.msg}
        </CustomAlert>
        <p className="text-14 mb-3">{t('forgot_login_text')}</p>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              rules={{
                required: `${t('forgot_password_email_field')} ${t(
                  'login_field_required',
                )}`,
                validate: async value => {
                  const emailRegex = /[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;
                  return (
                    emailRegex.test(value) || t('register_email_bad_format')
                  );
                },
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

export default ForgotLoginPage;
