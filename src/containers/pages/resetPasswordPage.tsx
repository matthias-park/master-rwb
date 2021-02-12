import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import TextInput from '../../components/TextInput';
import Button from 'react-bootstrap/Button';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Redirect, useParams } from 'react-router-dom';
import NotFoundPage from './notFoundPage';
import Spinner from 'react-bootstrap/Spinner';
import { useConfig } from '../../hooks/useConfig';
import ForgotPasswordResponse from '../../types/api/user/ForgotPassword';
import RailsApiResponse from '../../types/api/RailsApiResponse';

const ForgotPasswordPage = () => {
  const { code } = useParams<{ code?: string }>();
  const { register, handleSubmit, errors, formState, watch, trigger } = useForm(
    {
      mode: 'onBlur',
    },
  );
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
  const onSubmit = async ({ password }) => {
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      `/railsapi/v1/login/set_password`,
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
    return setApiResponse({
      success: result.Success,
      msg: result.Message || '',
    });
  };
  if (!code) {
    return <NotFoundPage />;
  }
  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      <h1 className="mb-4">{t('reset_password_page_title')}</h1>
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
            validate: value => {
              const valueValid = value.length > 7;
              const hasLowerCase = /[a-z]/.test(value);
              const hasUpperCase = /[A-Z]/.test(value);
              const hasNumbers = /\d/.test(value);
              const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(value);
              const mixOfThree =
                [
                  hasLowerCase,
                  hasUpperCase,
                  hasNumbers,
                  hasSpecialCharacters,
                ].filter(Boolean).length > 2;
              return (valueValid && mixOfThree) || t('register_password_weak');
            },
          })}
          error={errors.password}
          onBlur={() => watch('repeat_password') && trigger('repeat_password')}
          id="password"
          type="password"
          placeholder={t('reset_password_field')}
        />
        <TextInput
          ref={register({
            required: t('login_field_required'),
            validate: value =>
              value === watch('password') ||
              t('reset_password_need_match_password'),
          })}
          error={errors.repeat_password}
          id="repeat_password"
          type="password"
          placeholder={t('reset_password_repeat_field')}
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