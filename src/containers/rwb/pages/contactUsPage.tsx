import React, { useEffect, useMemo, useState } from 'react';
import { JSONFormPage } from '../../../types/api/JsonFormPage';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import { FormProvider, useForm } from 'react-hook-form';
import { useI18n } from '../../../hooks/useI18n';
import FieldFromJson from '../components/FieldFromJson';
import { postApi } from '../../../utils/apiUtils';
import SeoPages from '../../../types/api/content/SeoPages';
import CustomAlert from '../components/CustomAlert';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import { VALIDATIONS } from '../../../constants';
import { isValid as isDateValid } from 'date-fns';
import dayjs from 'dayjs';
import { useAuth } from '../../../hooks/useAuth';
import { useCaptcha } from '../../../hooks/useGoogleRecaptcha';
import { ThemeSettings } from '../../../constants';
import clsx from 'clsx';

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

const ContactUsForm = ({
  data,
  subText,
}: {
  data: JSONFormPage;
  subText?: boolean;
}) => {
  const { t, jsxT } = useI18n();
  const { user } = useAuth();
  const getToken = useCaptcha();
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
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
    if (date_of_birth) {
      fields.date_of_birth = dayjs(date_of_birth).format('YYYY-MM-DD');
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
    <>
      {!!submitResponse && (
        <CustomAlert
          show={!!submitResponse}
          variant={submitResponse.success ? 'success' : 'danger'}
        >
          {submitResponse.msg ||
            jsxT(
              `contact_page_${submitResponse.success ? 'success' : 'failed'}`,
            )}
        </CustomAlert>
      )}
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(onSubmit)} className="pb-4">
          {subText && (
            <small className="d-block mb-3">{jsxT('contact_form_text')}</small>
          )}
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
    </>
  );
};

const ContactUsPage = () => {
  const { icons: icon } = ThemeSettings!;
  const { jsxT } = useI18n();
  const { user } = useAuth();
  const { data, error, isValidating } = useApi<JSONFormPage>(
    user.loading ? null : [`/restapi/v1/contact_us/form`, user.logged_in],
  );
  const isDataLoading = (!data && !error) || isValidating;

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      {!!error && (
        <h2 className="mt-3 mb-5 text-center">
          {jsxT('contact_page_failed_to_load')}
        </h2>
      )}
      {!!data && (
        <h1 className="account-settings__title">{jsxT(data.title)}</h1>
      )}
      <div className="outer-info-block mb-3">
        <div className="contact_info">
          <div className="row">
            <div className="col-sm text-center align-items-center">
              <i className={clsx('mr-1', icon?.phone)}></i>
              {jsxT('contact_page_phone')}
            </div>
            <div className="col-sm text-center align-items-center">
              <i className={clsx('mr-1', icon?.mail)}></i>
              {jsxT('contact_page_email')}
            </div>
            <div className="col-sm text-center align-items-center">
              <i className={clsx('mr-1', icon?.clock)}></i>
              {jsxT('contact_page_hours')}
            </div>
          </div>
        </div>
      </div>
      <div className="outer-info-block">
        {!!data && <ContactUsForm data={data} />}
      </div>
    </main>
  );
};

export default ContactUsPage;
