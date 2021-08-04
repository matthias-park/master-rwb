import React, { useState } from 'react';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { postApi } from '../../../../utils/apiUtils';
import TextInput from '../../../../components/customFormInputs/TextInput';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import Authenticate2fa from '../../../../types/api/user/Authenticate2fa';
import CustomAlert from '../CustomAlert';
import { replaceStringTagsReact } from '../../../../utils/reactUtils';
import { VALIDATIONS } from '../../../../constants';

interface changePostForm {
  email: string;
}

const ChangePasswordForm = () => {
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const formMethods = useForm<changePostForm>({
    mode: 'onBlur',
  });
  const { formState, handleSubmit } = formMethods;
  const { t, jsxT } = useI18n();

  const submitChangePassword = async ({ email }: changePostForm) => {
    setApiResponse(null);
    const result = await postApi<RailsApiResponse<Authenticate2fa>>(
      '/railsapi/v1/user/login/forgot_password',
      {
        email,
      },
    );
    return setApiResponse({
      success: result.Success,
      msg: result.Message || t('api_response_failed'),
    });
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(submitChangePassword)}>
        {apiResponse && (
          <CustomAlert
            show
            variant={apiResponse.success ? 'success' : 'danger'}
          >
            <div>{replaceStringTagsReact(apiResponse?.msg!)}</div>
          </CustomAlert>
        )}
        <p className="change-pw__title mt-4">
          {jsxT('change_password_reset_title')}
        </p>
        <p>{jsxT('change_password_reset_desc')}</p>
        <TextInput
          rules={{
            required: t('change_password_email_required'),
            validate: async value =>
              VALIDATIONS.email(value) || t('change_password_email_bad_format'),
          }}
          id="email"
          title={t('change_password_email_field')}
        />
        <LoadingButton
          loading={!!formState.isSubmitting}
          className="mt-2"
          variant="primary"
          type="submit"
        >
          {t('change_password_submit_btn')}
        </LoadingButton>
      </Form>
    </FormProvider>
  );
};
export default ChangePasswordForm;
