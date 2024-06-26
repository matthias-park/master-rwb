import React, { useEffect, useMemo, useState } from 'react';
import { JSONFormPage } from '../../../types/api/JsonFormPage';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { useI18n } from '../../../hooks/useI18n';
import FieldFromJson from '../components/FieldFromJson';
import { postApi } from '../../../utils/apiUtils';
import SeoPages from '../../../types/api/content/SeoPages';
import HelpBlock from '../components/HelpBlock';
import CustomAlert from '../components/CustomAlert';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import { REGEX_EXPRESSION, VALIDATIONS } from '../../../constants';
import { isValid as isDateValid } from 'date-fns';
import dayjs from 'dayjs';
import { useAuth } from '../../../hooks/useAuth';
import { useCaptcha } from '../../../hooks/useGoogleRecaptcha';

const fieldValidations = {
  first_name: (value: string) =>
    VALIDATIONS.name(value) || 'field_only_letters',
  last_name: (value: string) => VALIDATIONS.name(value) || 'field_only_letters',
  email_address: (value: string) => VALIDATIONS.email(value) || 'email_invalid',
  phone_number: (value: string) =>
    VALIDATIONS.phone(value) || 'phone_number_invalid',
  text: (value: string) =>
    !!value.trim().length || 'contact_page_field_required',
  date_of_birth: (value: string) =>
    isDateValid(new Date(value)) || 'contact_us_invalid_date',
};

const ContactUsPage = () => {
  const { t, jsxT } = useI18n();
  const { user } = useAuth();
  const getToken = useCaptcha();
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const { data, error, isValidating } = useApi<JSONFormPage>(
    user.loading ? null : [`/restapi/v1/contact_us/form`, user.logged_in],
  );
  const defaultValues = useMemo(
    () =>
      data?.form.reduce((obj: any, field: any) => {
        if (field.type !== 'submit') obj[field.id] = '';
        if (field.default) {
          obj[field.id] =
            typeof field.default === 'object'
              ? field.default.title
              : field.default;
        } else if (field.type === 'select') {
          obj[field.id] = '-1';
        }
        return obj;
      }, {}),
    [data],
  );
  const formMethods = useForm({
    mode: 'onBlur',
    defaultValues,
  });
  const { handleSubmit, reset } = formMethods;
  const isDataLoading = (!data && !error) || isValidating;

  useEffect(() => {
    reset();
    setSubmitResponse(null);
  }, [user.logged_in]);
  useEffect(() => {
    reset(defaultValues);
  }, [data]);

  useEffect(() => {
    if (formMethods.formState.isDirty && submitResponse) {
      setSubmitResponse(null);
    }
  }, [formMethods.formState.isDirty]);

  const onSubmit = async ({ file, phone_number, date_of_birth, ...fields }) => {
    const captchaToken = await getToken?.('contact_us').catch(() => '');
    if (file) {
      fields.file = file;
    }
    if (phone_number) {
      fields.phone_number = phone_number.replace(
        REGEX_EXPRESSION.PHONE_NUMBER_NORMALIZE,
        '',
      );
    }
    if (date_of_birth) {
      fields.date_of_birth = dayjs(date_of_birth).format('YYYY-MM-DD');
    }
    for (const field of data?.form || []) {
      if (field.type === 'select' && fields[field.id] === '-1') {
        delete fields[field.id];
      }
    }
    if (captchaToken) fields.captcha_token = captchaToken;
    const response = await postApi<RailsApiResponse<SeoPages>>(
      data!.action,
      fields,
      {
        formData: true,
      },
    ).catch(() => {
      return {
        Success: false,
        Code: -1,
        Message: null,
      };
    });
    if (response.Success) {
      reset(defaultValues);
    }
    return setSubmitResponse({
      success: response.Success,
      msg: response.Message,
    });
  };

  return (
    <main className="page-container">
      <div className="page-inner">
        {isDataLoading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        )}
        {!!error && (
          <h2 className="mt-3 mb-5 text-center">
            {jsxT('contact_page_failed_to_load')}
          </h2>
        )}
        {!!data && !isValidating && (
          <div className="d-flex flex-column flex-xl-row">
            <div className="flex-grow-1 mr-0 mr-xl-5">
              <h2 className="mb-4">{jsxT(data.title)}</h2>
              <small className="d-block mb-3">
                {jsxT('questions_or_suggestions')}
              </small>
              {!!submitResponse && (
                <CustomAlert
                  show={!!submitResponse}
                  variant={submitResponse.success ? 'success' : 'danger'}
                >
                  {submitResponse.msg ||
                    jsxT(
                      `contact_page_${
                        submitResponse.success ? 'success' : 'failed'
                      }`,
                    )}
                </CustomAlert>
              )}
              <FormProvider {...formMethods}>
                <Form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                  <small className="d-block mb-3">
                    {jsxT('contact_form_text')}
                  </small>
                  {data.form.map(field => {
                    if (field.disabled) {
                      return null;
                    }
                    return (
                      <FieldFromJson
                        key={field.id}
                        field={field}
                        rules={{
                          required:
                            field.required &&
                            `${t(field.title)} ${t(
                              field.type === 'select'
                                ? 'contact_us_select_required'
                                : 'contact_page_field_required',
                            )}`,
                          validate: value => {
                            if (!value) return true;
                            const valid = fieldValidations[field.id]?.(value);
                            return typeof valid === 'string' ? t(valid) : valid;
                          },
                        }}
                      />
                    );
                  })}
                </Form>
              </FormProvider>
              {jsxT('contact_page_address')}
            </div>
            <HelpBlock
              blocks={['faq', 'phone', 'email']}
              className="d-block w-md-100 mt-2 mt-xl-0"
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ContactUsPage;
