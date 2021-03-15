import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { ControlledTextInput } from '../../components/TextInput';
import Button from 'react-bootstrap/Button';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import ForgotPasswordResponse from '../../types/api/user/ForgotPassword';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import Spinner from 'react-bootstrap/Spinner';
import { Redirect } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useGTM from '../../hooks/useGTM';
import { isEqual } from 'lodash';

const ForgotPasswordPage = () => {
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const { handleSubmit, errors, formState } = formMethods;
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { t } = useI18n();
  const { addToast } = useToasts();
  const { user } = useConfig((prev, next) => isEqual(prev.user, next.user));
  const sendDataToGTM = useGTM();

  useEffect(() => {
    sendDataToGTM({
      event: 'ForgottenPassword',
    });
  }, []);

  if (user.logged_in) {
    return <Redirect to="/" />;
  }

  const onSubmit = async ({ email }) => {
    sendDataToGTM({
      event: 'LoginPasswordFormSubmit',
    });
    const result = await postApi<RailsApiResponse<ForgotPasswordResponse>>(
      '/railsapi/v1/user/login/forgot_password',
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
    <main className="page-container pt-5">
      <div className="page-inner">
        <h2 className="mb-4">{t('forgot_password_page_title')}</h2>
        <p className="text-14 mb-3">{t('forgot_password_text')}</p>
        <FormProvider {...formMethods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Alert
              show={typeof apiResponse === 'boolean'}
              variant={apiResponse ? 'success' : 'danger'}
            >
              {t(`forgot_password_${apiResponse ? 'success' : 'failed'}`)}
            </Alert>
            <ControlledTextInput
              rules={{
                required: t('login_field_required'),
                validate: async value => {
                  const emailRegex = /[a-zA-Z0-9.!#$%&‘*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;
                  return (
                    emailRegex.test(value) || t('register_email_bad_format')
                  );
                },
              }}
              error={errors.email}
              id="email"
              placeholder={t('forgot_password_email_field')}
            />
            <Button
              variant="primary"
              disabled={!!formState.isSubmitting || !!errors.email}
              type="submit"
              data-testid="button"
              className="mt-3"
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
        </FormProvider>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
