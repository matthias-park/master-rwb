import React, { useEffect, useMemo, useState } from 'react';
import { JSONFormPage } from '../../types/api/JsonFormPage';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import FieldFromJson from '../../components/FieldFromJson';
import { postApi } from '../../utils/apiUtils';
import SeoPages from '../../types/api/content/SeoPages';
import HelpBlock from '../../components/HelpBlock';
import CustomAlert from '../../components/CustomAlert';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useApi from '../../hooks/useApi';
import { REGEX_EXPRESSION, VALIDATIONS } from '../../constants';
import { isValid as isDateValid } from 'date-fns';
import dayjs from 'dayjs';
import { useAuth } from '../../hooks/useAuth';

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
  const { t } = useI18n();
  const { user } = useAuth();
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const { data, error, isValidating } = useApi<JSONFormPage>(
    user.loading ? null : [`/railsapi/v1/contact_us/form`, user.logged_in],
  );
  const defaultValues = useMemo(
    () =>
      data?.form.reduce((obj: any, field: any) => {
        obj[field.id] = '';
        if (field.default) {
          obj[field.id] =
            typeof field.default === 'object'
              ? field.default.title
              : field.default;
        } else if (field.type === 'select') {
          obj[field.id] = '-1';
        }
        return obj;
      }),
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
    if (file?.length) {
      fields.file = file[0];
    }
    if (phone_number) {
      fields.phone_number = phone_number.replaceAll(
        REGEX_EXPRESSION.PHONE_NUMBER_NORMALIZE,
        '',
      );
    }
    if (date_of_birth) {
      fields.date_of_birth = dayjs(date_of_birth).format('YYYY-MM-DD');
    }
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
    <main className="page-container pt-4">
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
        {!!data && !isValidating && (
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
              <FormProvider {...formMethods}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <small className="d-block mb-3">
                    {t('contact_form_text')}
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
                            `${field.title} ${t(
                              field.type === 'select'
                                ? 'contact_us_select_required'
                                : 'contact_page_field_required',
                            )}`,
                          validate: value => {
                            const valid = fieldValidations[field.id]?.(value);
                            return typeof valid === 'string' ? t(valid) : valid;
                          },
                        }}
                      />
                    );
                  })}
                </Form>
              </FormProvider>
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
