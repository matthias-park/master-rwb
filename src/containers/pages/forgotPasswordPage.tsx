import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import TextInput from '../../components/TextInput';
import Button from 'react-bootstrap/Button';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import ForgotPasswordResponse from '../../types/api/user/ForgotPassword';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Spinner from 'react-bootstrap/Spinner';
import { Redirect } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import RailsApiResponse from '../../types/api/RailsApiResponse';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
  });
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { user } = useConfig();

  if (user.logged_in) {
    return <Redirect to="/" />;
  }

  const onSubmit = async ({ email }) => {
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      '/railsapi/v1/login/forgot_password',
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
      msg: result.Message || '',
    });
  };
  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      <h1 className="mb-4">{t('forgot_password_page_title')}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Alert
          show={!!apiResponse}
          variant={apiResponse?.success ? 'success' : 'danger'}
        >
          <div dangerouslySetInnerHTML={{ __html: apiResponse?.msg || '' }} />
        </Alert>
        <TextInput
          ref={register({
            required: t('login_field_required'),
            validate: async value => {
              const emailRegex = /[a-zA-Z0-9.!\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;
              return emailRegex.test(value) || t('register_email_bad_format');
            },
          })}
          error={errors.email}
          id="email"
          placeholder={t('forgot_password_email_field')}
        />
        <Button
          variant="primary"
          disabled={!!formState.isSubmitting || !!errors.email}
          type="submit"
          data-testid="button"
        >
          {!!formState.isSubmitting && (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{' '}
            </>
          )}
          {t('forgot_password_submit_btn')}
        </Button>
      </Form>
    </main>
  );
};

export default ForgotPasswordPage;
