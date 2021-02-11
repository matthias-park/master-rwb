import React, { useState } from 'react';
import useSWR from 'swr';
import { JSONFormPage } from '../../types/api/JsonFormPage';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import FieldFromJson from '../../components/FieldFromJson';
import { useConfig } from '../../hooks/useConfig';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import SeoPages from '../../types/api/content/SeoPages';
import Alert from 'react-bootstrap/Alert';
import RailsApiResponse from '../../types/api/RailsApiResponse';

const loggedInHiddenFields = ['first_name', 'last_name', 'email_address'];

const ContactUsPage = () => {
  const { t } = useI18n();
  const { user } = useConfig();
  const { addToast } = useToasts();
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
  });
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const { data, error } = useSWR<JSONFormPage>(`/railsapi/v1/contact_us/form`);
  const isDataLoading = !data && !error;

  const onSubmit = async ({ file, ...fields }) => {
    if (file?.length) {
      fields.file = file[0];
    }
    if (user.logged_in) {
      fields.first_name = user.first_name;
      fields.last_name = user.last_name;
      fields.email_address = user.email;
    }
    const response = await postApi<RailsApiResponse<SeoPages>>(
      data!.action,
      fields,
      {
        formData: true,
      },
    ).catch(err => {
      addToast('failed to send form', {
        appearance: 'error',
        autoDismiss: true,
      });
      return {
        Success: false,
        Code: -1,
        Message: null,
      };
    });
    return setSubmitResponse(
      response?.Success || response?.Message
        ? {
            success: response.Success,
            msg: response.Message,
          }
        : null,
    );
  };

  return (
    <main className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {t('contact_page_failed_to_load')}
        </h2>
      )}
      {!!data && (
        <>
          <h1 className="mb-4">{data.title}</h1>
          {!!submitResponse && (
            <Alert
              show={!!submitResponse}
              variant={submitResponse.success ? 'success' : 'danger'}
            >
              {submitResponse.msg || t('contact_page_success')}
            </Alert>
          )}
          <Form onSubmit={handleSubmit(onSubmit)}>
            {data.form.map(field => {
              if (user.logged_in && loggedInHiddenFields.includes(field.id)) {
                return null;
              }
              return (
                <FieldFromJson
                  key={field.id}
                  field={field}
                  error={errors[field.id]}
                  ref={register({
                    required: field.required && t('login_field_required'),
                  })}
                  formState={formState}
                />
              );
            })}
          </Form>
        </>
      )}
    </main>
  );
};

export default ContactUsPage;
