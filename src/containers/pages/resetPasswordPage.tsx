import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import TextInput from '../../components/TextInput';
import Button from 'react-bootstrap/Button';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import NotFoundPage from './notFoundPage';
import Spinner from 'react-bootstrap/Spinner';

const ForgotPasswordPage = () => {
  const { code } = useParams<{ code?: string }>();
  const { register, handleSubmit, errors, formState, watch, trigger } = useForm(
    {
      mode: 'onBlur',
    },
  );
  const [apiResponse, setApiResponse] = useState<{
    msg: string;
    success: boolean;
  } | null>(null);
  const { t } = useI18n();
  const { addToast } = useToasts();
  const onSubmit = async ({ password, repeat_password }) => {
    const result = await postApi(`/set_password/${code}?response_json=true`, {
      new_password: password,
      new_password_confirm: repeat_password,
      reset_code: code!,
    }).catch(() => {
      addToast('failed to set new password', {
        appearance: 'error',
        autoDismiss: true,
      });
      // return {
      //   errors: {},
      //   message: '',
      //   status: 'timeout',
      //   title: '',
      // };
    });
    console.log(result);
    // if (result.status !== 'timeout') {
    //   setApiResponse({
    //     msg: result.message,
    //     success: result.status === 'success',
    //   });
    // }
    return;
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
          {apiResponse?.msg}
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
