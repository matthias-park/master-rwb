import React, { useState } from 'react';
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
import HelpBlock from '../../components/HelpBlock';
import CustomAlert from '../../components/CustomAlert';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useApi from '../../hooks/useApi';
import isEqual from 'lodash.isequal';

const loggedInHiddenFields = ['first_name', 'last_name', 'email_address'];
const fieldValidations = {
  first_name: (value: string) =>
    /^[a-z]*$/gi.test(value) || 'field_only_letters',
  last_name: (value: string) =>
    /^[a-z]*$/gi.test(value) || 'field_only_letters',
  email_address: (value: string) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value,
    ) || 'email_invalid',
  text: (value: string) =>
    !!value.trim().length || 'contact_page_field_required',
};

const ContactUsPage = () => {
  const { t } = useI18n();
  const { user } = useConfig((prev, next) => isEqual(prev.user, next.user));
  const { addToast } = useToasts();
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
  });
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const { data, error } = useApi<JSONFormPage>(`/railsapi/v1/contact_us/form`);
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

    console.log(response);
    return setSubmitResponse({
      success: response.Success,
      msg: response.Message,
    });
  };

  return (
    <main className="page-container pt-5">
      <div className="page-inner">
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
          <div className="d-flex flex-column flex-md-row">
            <div className="flex-grow-1 mr-0 mr-md-5">
              <h2 className="mb-4">{data.title}</h2>
              <small className="d-block mb-2">
                {t('questions_or_suggestions')}
              </small>
              <small>
                {t('call_us')} <b>{t('help_call_us_number')}</b>
              </small>
              <ul className="my-3">
                <li>{t('time_workday')}</li>
                <li>{t('time_weekend')}</li>
              </ul>
              <small className="d-block mb-4">{t('use_form_below')}</small>
              {!!submitResponse && (
                <CustomAlert
                  show={!!submitResponse}
                  variant={submitResponse.success ? 'success' : 'danger'}
                >
                  {submitResponse.msg ||
                    t(
                      `contact_page_${
                        submitResponse.success ? 'success' : 'failed'
                      }`,
                    )}
                </CustomAlert>
              )}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <small className="d-block mb-3">{t('contact_form_text')}</small>
                {data.form.map(field => {
                  if (
                    user.logged_in &&
                    loggedInHiddenFields.includes(field.id)
                  ) {
                    return null;
                  }
                  return (
                    <FieldFromJson
                      key={field.id}
                      field={field}
                      error={errors[field.id]}
                      ref={register({
                        required:
                          field.required && t('contact_page_field_required'),
                        validate: value => {
                          const valid = fieldValidations[field.id]?.(value);
                          return typeof valid === 'string' ? t(valid) : valid;
                        },
                      })}
                      formState={formState}
                    />
                  );
                })}
              </Form>
            </div>
            <HelpBlock
              blocks={['faq', 'phone', 'email']}
              className="d-block w-md-100 mt-5 mt-md-0"
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ContactUsPage;
