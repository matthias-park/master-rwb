import React, { useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { postApi } from '../../../utils/apiUtils';
import CustomAlert from '../components/CustomAlert';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ForgotPasswordResponse from '../../../types/api/user/ForgotPassword';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';
import LoadingButton from '../../../components/LoadingButton';
import { VALIDATIONS } from '../../../constants';
import TextInput from '../../../components/customFormInputs/TextInput';
import RedirectNotFound from '../../../components/RedirectNotFound';
import { ComponentSettings } from '../../../constants';

const ForgotPasswordPage = () => {
  const { code } = useParams<{ code?: string }>();
  const { requiredValidations } = ComponentSettings?.register!;
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const { handleSubmit, formState, watch, trigger } = formMethods;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { t } = useI18n();
  const sendDataToGTM = useGTM();

  const onSubmit = async ({ password, email }) => {
    setApiResponse(null);
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      `/restapi/v2/user/login/set_password`,
      {
        new_password: password,
        reset_code: code!,
        email: email,
      },
    ).catch((res: RailsApiResponse<null>) => res);
    if (result.Success) {
      sendDataToGTM({
        event: 'LoginPasswordChange',
      });
    }
    return setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
  };
  if (!code) {
    return <RedirectNotFound />;
  }
  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h2 className="mb-4">{t('reset_password_page_title')}</h2>
        <CustomAlert
          show={!!apiResponse}
          variant={
            (apiResponse && (apiResponse.success ? 'success' : 'danger')) || ''
          }
        >
          <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
        </CustomAlert>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              rules={{
                required: t('reset_password_field_required'),
                validate: async value =>
                  VALIDATIONS.email(value) || t('reset_email_bad_format'),
              }}
              id="email"
              type="email"
              title={t('reset_password_email_field')}
            />
            <TextInput
              disableCopyPaste
              disabled={!!apiResponse?.success}
              rules={{
                required: `${t('reset_password_field')} ${t(
                  'reset_password_field_required',
                )}`,
                validate: value =>
                  VALIDATIONS.password(value, requiredValidations) ||
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
              disabled={!!apiResponse?.success}
              rules={{
                required: `${t('reset_password_field')} ${t(
                  'reset_password_field_required',
                )}`,
                validate: value =>
                  (value === watch('password') &&
                    VALIDATIONS.password(value, requiredValidations)) ||
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
