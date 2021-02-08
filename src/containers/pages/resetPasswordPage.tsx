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

const ForgotPasswordPage = () => {
  const { code } = useParams<{ code?: string }>();
  const { register, handleSubmit, errors, formState, watch, trigger } = useForm(
    {
      mode: 'onBlur',
    },
  );
  const [apiResponse, setApiResponse] = useState<boolean | null>(null);
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { user } = useConfig();

  if (user.logged_in) {
    return <Redirect to="/" />;
  }
  const onSubmit = async ({ password, repeat_password }) => {
    const result = await postApi<ForgotPasswordResponse>(
      `/set_password/${code}?response_json=true`,
      {
        new_password: password,
        new_password_confirm: repeat_password,
        reset_code: code!,
      },
    ).catch(() => {
      addToast('failed to set new password', {
        appearance: 'error',
        autoDismiss: true,
      });
      return {
        success: false,
      };
    });
    return setApiResponse(result?.success);
  };
  if (!code) {
    return <NotFoundPage />;
  }
  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      <h1 className="mb-4">{t('reset_password_page_title')}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Alert
          show={typeof apiResponse === 'boolean'}
          variant={apiResponse ? 'success' : 'danger'}
        >
          {t(`set_password_${apiResponse ? 'success' : 'failed'}`)}
        </Alert>
        <TextInput
          ref={register({
            required: t('login_field_required'),
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
