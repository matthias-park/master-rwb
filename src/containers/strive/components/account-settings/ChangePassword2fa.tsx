import React, { useState } from 'react';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { useAuth } from '../../../../hooks/useAuth';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { postApi } from '../../../../utils/apiUtils';
import TextInput from '../../../../components/customFormInputs/TextInput';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import Authenticate2fa from '../../../../types/api/user/Authenticate2fa';
import CustomAlert from '../CustomAlert';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import { FormFieldValidation } from '../../../../constants';
import { useDispatch } from 'react-redux';
import { setTwoFactoAuth } from '../../../../state/reducers/user';

interface authenticatePostForm {
  pin?: string;
}

const ChangePassword2fa = () => {
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const dispatch = useDispatch();
  const formMethods = useForm<authenticatePostForm>({
    mode: 'onBlur',
  });
  const { formState, reset, handleSubmit } = formMethods;
  const { t, jsxT } = useI18n();
  const { user, updateUser } = useAuth();

  const toggle2fa = async ({ pin }: authenticatePostForm) => {
    setApiResponse(null);
    const result = await postApi<RailsApiResponse<Authenticate2fa>>(
      '/railsapi/v1/user/settings/authentication',
      {
        enable: !user.authentication_enabled,
        pin,
      },
    );
    if ((showPinInput || user.authentication_enabled) && result.Success) {
      setShowPinInput(false);
      updateUser();
      reset();
      dispatch(setTwoFactoAuth(!user.authentication_enabled));
    }
    if (result?.Data?.pin_required) {
      setShowPinInput(true);
    }
    setApiResponse({
      success: result.Success,
      msg: result.Message || t('request_failed_2fa'),
    });
    return;
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(toggle2fa)}>
        {apiResponse && (
          <CustomAlert
            show
            className="mt-4"
            variant={apiResponse.success ? 'success' : 'danger'}
          >
            <div>{replaceStringTagsReact(apiResponse?.msg!)}</div>
          </CustomAlert>
        )}
        <p className="change-pw__title mt-4">
          {jsxT('change_password_2fa_title')}
        </p>
        <p>{jsxT('change_password_2fa_desc')}</p>
        {showPinInput && (
          <TextInput
            rules={{
              required: t('login_pin_required'),
            }}
            validation={
              apiResponse && !apiResponse?.success
                ? FormFieldValidation.Invalid
                : undefined
            }
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
        )}
        <LoadingButton
          loading={!!formState.isSubmitting}
          className="mt-2"
          variant="primary"
          type="submit"
        >
          {t(
            user.authentication_enabled
              ? 'change_password_disable_2fa'
              : 'change_password_enable_2fa',
          )}
        </LoadingButton>
      </Form>
    </FormProvider>
  );
};
export default ChangePassword2fa;
