import React, { useState } from 'react';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { FormProvider, useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { postApi } from '../../../../utils/apiUtils';
import TextInput from '../../../../components/customFormInputs/TextInput';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import Authenticate2fa from '../../../../types/api/user/Authenticate2fa';
import CustomAlert from '../CustomAlert';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import { VALIDATIONS } from '../../../../constants';
import useGTM from '../../../../hooks/useGTM';
import ForgotPasswordResponse from '../../../../types/api/user/ForgotPassword';

interface changePostForm {
  email: string;
  reset_code: string;
  password: string;
  repeat_password: string;
}

const ChangePasswordForm = () => {
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const formMethods = useForm<changePostForm>({
    mode: 'onBlur',
  });
  const { handleSubmit, watch, trigger, reset } = formMethods;
  const { t, jsxT } = useI18n();
  const sendDataToGTM = useGTM();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ email, reset_code, password }) => {
    if (step === 1) {
      getResetCode(email);
    }
    if (step === 2) {
      setPassword(password, reset_code);
    }
  };

  const getResetCode = async email => {
    setIsLoading(true);
    setApiResponse(null);
    const result = await postApi<RailsApiResponse<Authenticate2fa>>(
      '/restapi/v2/user/login/forgot_password',
      {
        email,
      },
    ).catch(err => err);
    setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
    if (result.Success) {
      setStep(prev => prev + 1);
    }
    setIsLoading(false);
  };

  const setPassword = async (password, reset_code) => {
    setIsLoading(true);
    setApiResponse(null);
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      `/restapi/v2/user/login/set_password`,
      {
        new_password: password,
        reset_code: reset_code,
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
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {apiResponse && (
          <CustomAlert
            show
            variant={apiResponse.success ? 'success' : 'danger'}
          >
            <div>{replaceStringTagsReact(apiResponse?.msg!)}</div>
          </CustomAlert>
        )}
        <p className="change-pw__title">
          {jsxT('change_password_reset_title')}
        </p>
        {step <= 2 && (
          <p className="mb-3">{t(`change_password_step_${step}_text`)}</p>
        )}
        {step === 1 && (
          <>
            <TextInput
              rules={{
                required: t('change_password_email_required'),
                validate: async value =>
                  VALIDATIONS.email(value) ||
                  t('change_password_email_bad_format'),
              }}
              id="email"
              title={t('change_password_email_field')}
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
              disableCopyPaste
              rules={{
                required: `${t('reset_password_field')} ${t(
                  'reset_password_field_required',
                )}`,
                validate: value =>
                  VALIDATIONS.password(value, 3) || t('register_password_weak'),
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
                    VALIDATIONS.password(value, 3)) ||
                  t('reset_password_need_match_password'),
              }}
              id="repeat_password"
              autoComplete="new-password"
              type="password"
              title={t('reset_password_repeat_field')}
              toggleVisibility
            />
            <TextInput
              rules={{
                required: t('reset_code_field_required'),
              }}
              id="reset_code"
              title={t('forgot_password_reset_code_field')}
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
  );
};
export default ChangePasswordForm;
