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
import { useConfig } from '../../hooks/useConfig';
import { Redirect } from 'react-router-dom';

const ForgotLoginPage = () => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
  });
  const [apiResponse, setApiResponse] = useState<{
    msg: string;
    success: boolean;
  } | null>(null);
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { user } = useConfig();

  if (user.logged_in) {
    return <Redirect to="/" />;
  }

  const onSubmit = async ({ email }) => {
    const result = await postApi<ForgotPasswordResponse>(
      '/players/forgot_login.json',
      {
        email,
      },
    ).catch(() => {
      addToast('failed to recover username', {
        appearance: 'error',
        autoDismiss: true,
      });
      return {
        errors: {},
        message: '',
        status: 'timeout',
        title: '',
      };
    });
    if (result.status !== 'timeout') {
      setApiResponse({
        msg: result.message,
        success: result.status === 'success',
      });
    }
    return;
  };
  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      <h1 className="mb-4">{t('forgot_login_page_title')}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Alert
          show={!!apiResponse}
          variant={apiResponse?.success ? 'success' : 'danger'}
        >
          {apiResponse?.msg}
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

export default ForgotLoginPage;
