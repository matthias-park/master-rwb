import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { ControlledTextInput } from '../../components/TextInput';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import CustomAlert from '../../components/CustomAlert';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { Redirect, useParams } from 'react-router-dom';
import NotFoundPage from './notFoundPage';
import { useConfig } from '../../hooks/useConfig';
import ForgotPasswordResponse from '../../types/api/user/ForgotPassword';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useGTM from '../../hooks/useGTM';
import isEqual from 'lodash.isequal';
import LoadingButton from '../../components/LoadingButton';
import { VALIDATIONS } from '../../constants';

const ForgotPasswordPage = () => {
  const { code } = useParams<{ code?: string }>();
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const { handleSubmit, formState, watch, trigger } = formMethods;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { user } = useConfig((prev, next) => isEqual(prev.user, next.user));
  const sendDataToGTM = useGTM();

  if (user.logged_in) {
    return <Redirect to="/" />;
  }
  const onSubmit = async ({ password }) => {
    setApiResponse(null);
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      `/railsapi/v1/user/login/set_password`,
      {
        new_password: password,
        reset_code: code!,
      },
    ).catch((res: RailsApiResponse<null>) => {
      if (res.Fallback) {
        addToast('failed to set new password', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      return res;
    });
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
    return <NotFoundPage />;
  }
  return (
    <main className="page-container">
      <div className="page-inner page-inner--small">
        <h2 className="mb-4">{t('reset_password_page_title')}</h2>
        <CustomAlert
          show={!!apiResponse}
          variant={apiResponse?.success ? 'success' : 'danger'}
        >
          <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
        </CustomAlert>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <ControlledTextInput
              disableCopyPaste
              disabled={!!apiResponse?.success}
              rules={{
                required: t('reset_password_field_required'),
                validate: value =>
                  VALIDATIONS.passwordMixOfThree(value) ||
                  t('register_password_weak'),
              }}
              error={formState.errors.password}
              onBlur={() =>
                watch('repeat_password') && trigger('repeat_password')
              }
              id="password"
              type="password"
              placeholder={t('reset_password_field')}
              toggleVisibility
            />
            <ControlledTextInput
              disableCopyPaste
              disabled={!!apiResponse?.success}
              rules={{
                required: t('reset_password_field_required'),
                validate: value =>
                  value === watch('password') ||
                  t('reset_password_need_match_password'),
              }}
              error={formState.errors.repeat_password}
              id="repeat_password"
              type="password"
              placeholder={t('reset_password_repeat_field')}
              toggleVisibility
            />
            <LoadingButton
              variant="primary"
              disabled={
                !!formState.errors.email ||
                !formState.isValid ||
                !!apiResponse?.success
              }
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
