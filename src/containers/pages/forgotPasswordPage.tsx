import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { ControlledTextInput } from '../../components/TextInput';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import ForgotPasswordResponse from '../../types/api/user/ForgotPassword';
import CustomAlert from '../../components/CustomAlert';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useGTM from '../../hooks/useGTM';
import isEqual from 'lodash.isequal';
import LoadingButton from '../../components/LoadingButton';
import { VALIDATIONS } from '../../constants';

const ForgotPasswordPage = () => {
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const { handleSubmit, formState } = formMethods;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { user } = useConfig((prev, next) => isEqual(prev.user, next.user));
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
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      '/railsapi/v1/user/login/forgot_password',
      {
        email,
      },
    ).catch((res: RailsApiResponse<null>) => {
      if (res.Fallback) {
        addToast('failed to recover password', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      return res;
    });

    return setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
  };
  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h2 className="mb-4">{t('forgot_password_page_title')}</h2>
        <CustomAlert
          show={!!apiResponse}
          variant={apiResponse?.success ? 'success' : 'danger'}
        >
          {apiResponse?.msg}
        </CustomAlert>
        <p className="text-14 mb-3">{t('forgot_password_text')}</p>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <ControlledTextInput
              rules={{
                required: t('login_field_required'),
                validate: async value =>
                  VALIDATIONS.email(value) || t('register_email_bad_format'),
              }}
              error={formState.errors.email}
              id="email"
              placeholder={t('forgot_password_email_field')}
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
