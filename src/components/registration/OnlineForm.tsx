import TextInput from '../TextInput';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../hooks/useI18n';
import {
  ValidateRegisterInput,
  ValidateRegisterPersonalCode,
} from '../../types/api/user/Registration';
import { useForm } from 'react-hook-form';
import { Spinner } from 'react-bootstrap';
import { FormFieldValidation } from '../../constants';
import { OnlineFormBlock } from '../../types/RegistrationBlock';
import Alert from 'react-bootstrap/Alert';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import {
  RegistrationResponse,
  RegistrationPostalCodeAutofill,
} from '../../types/api/user/Registration';
import AutocompleteTextInput from '../AutocompleteTextInput';
import { PostCodeInfo } from '../../types/api/user/Registration';

interface Props {
  checkEmailAvailable: (email: string) => Promise<ValidateRegisterInput | null>;
  checkLoginAvailable: (login: string) => Promise<ValidateRegisterInput | null>;
  checkPersonalCode: (
    personalCode: string,
  ) => Promise<RailsApiResponse<ValidateRegisterPersonalCode | null>>;
  checkPostalCode: (
    postCode: string,
  ) => Promise<RailsApiResponse<RegistrationPostalCodeAutofill | null>>;
  handleRegisterSubmit: (
    form: any,
  ) => Promise<RailsApiResponse<RegistrationResponse | null>>;
}

const blocks = (
  props: Props,
  t: any,
  setValidation: any,
  validateRepeat: any,
): OnlineFormBlock[] => [
  {
    title: 'personal_info',
    fields: [
      {
        id: 'login',
        type: 'text',
        required: true,
        validate: async value => {
          let valid: string | boolean = true;
          setValidation('login', FormFieldValidation.Validating);
          const res = await props.checkLoginAvailable(value);
          if (res?.Exists && !res.Message)
            res.Message = t('register_already_taken');
          valid = res?.Message || !res?.Exists;
          setValidation(
            'login',
            res?.Exists ?? false
              ? FormFieldValidation.Invalid
              : FormFieldValidation.Valid,
          );
          return valid;
        },
      },
      {
        id: 'firstname',
        type: 'text',
        required: true,
      },
      {
        id: 'lastname',
        type: 'text',
        required: true,
      },
      {
        id: 'street',
        type: 'text',
        required: true,
      },
      {
        id: 'postal_code',
        type: 'text',
        required: true,
        validate: value => /^(?:(?:[1-9])(?:\d{3}))$/.test(value),
        labelKey: (value: PostCodeInfo) => value.zip_code,
        autoComplete: async value => {
          const res = await props.checkPostalCode(value);
          if (!res.Data?.result) {
            throw res.Message || t('register_input_postal_code_invalid');
          }
          return Object.values(res.Data.result);
        },
      },
      {
        id: 'phone_number',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    title: 'over_18',
    fields: [
      {
        id: 'personal_code',
        type: 'text',
        required: true,
        validate: async value => {
          let valid: string | boolean = true;
          setValidation('personal_code', FormFieldValidation.Validating);
          const res = await props.checkPersonalCode(value);
          if (!res?.Success) {
            valid = t('register_personal_code_invalid');
          }
          setValidation(
            'personal_code',
            !res?.Success
              ? FormFieldValidation.Invalid
              : FormFieldValidation.Valid,
          );
          return valid;
        },
      },
    ],
  },
  {
    title: 'email_section',
    fields: [
      {
        id: 'email',
        type: 'text',
        required: true,
        triggerId: 'repeat_email',
        validate: async value => {
          let valid: string | boolean = true;
          setValidation('email', FormFieldValidation.Validating);
          const emailRegex = /[a-zA-Z0-9.!\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;
          if (!emailRegex.test(value)) {
            setValidation('email', FormFieldValidation.Invalid);
            return t('register_email_bad_format');
          }
          const res = await props.checkEmailAvailable(value);
          valid = res?.Success || res?.Message || t('register_already_taken');
          setValidation(
            'email',
            typeof valid === 'boolean' && valid
              ? FormFieldValidation.Valid
              : FormFieldValidation.Invalid,
          );
          return valid;
        },
      },
      {
        id: 'repeat_email',
        type: 'text',
        required: true,
        validate: value => {
          let valid: string | boolean = true;
          setValidation('repeat_email', FormFieldValidation.Validating);
          valid = validateRepeat('email', value);
          setValidation(
            'repeat_email',
            typeof valid === 'boolean' && valid
              ? FormFieldValidation.Valid
              : FormFieldValidation.Invalid,
          );
          return valid;
        },
      },
    ],
  },
  {
    title: 'password_section',
    fields: [
      {
        id: 'password',
        type: 'password',
        autoComplete: 'new-password',
        triggerId: 'repeat_password',
        required: true,
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
          setValidation(
            'password',
            valueValid && mixOfThree
              ? FormFieldValidation.Valid
              : FormFieldValidation.Invalid,
          );
          return (valueValid && mixOfThree) || t('register_password_weak');
        },
      },
      {
        id: 'repeat_password',
        required: true,
        type: 'password',
        validate: value => {
          const valid = validateRepeat('password', value);
          setValidation(
            'repeat_password',
            typeof valid === 'boolean' && valid
              ? FormFieldValidation.Valid
              : FormFieldValidation.Invalid,
          );
          return valid;
        },
      },
    ],
  },
  {
    fields: [
      {
        id: 'newsletter',
        type: 'checkbox',
      },
      {
        id: 'terms_and_conditions',
        type: 'checkbox',
        required: true,
      },
    ],
  },
];

const OnlineForm = (props: Props) => {
  const { t, jsxT } = useI18n();
  const [apiError, setApiError] = useState<string | null>(null);
  const [validationForms, setValidationForms] = useState<{
    [key: string]: FormFieldValidation;
  }>({});
  const {
    register,
    handleSubmit,
    errors,
    watch,
    trigger,
    formState,
    setError,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
  });
  const setValidation = (id: string, status: FormFieldValidation) =>
    setValidationForms({ ...validationForms, [id]: status });
  const validateRepeat = (id: string, value: string) => {
    return value === watch(id) || t(`register_need_match_${id}`);
  };
  const triggerRepeat = (id: string) => {
    return watch(id, '') !== '' && trigger(id);
  };
  const onSubmit = async ({ terms_and_conditions, postal_code, ...data }) => {
    const postal_info = await props.checkPostalCode(postal_code);
    const city =
      Object.values(postal_info.Data?.result || {})[0]?.locality || '';
    const response = await props.handleRegisterSubmit({
      ...data,
      city,
      postal_code,
    });
    if (!response.Success) {
      return setApiError(response.Message);
    }
    return setApiError(null);
  };
  return (
    <div className="reg-form">
      <h1 className="reg-form__title">{jsxT('register_title')}</h1>
      <p className="reg-form__sub-title">{jsxT('register_desc')}</p>
      <a href="#" className="text-14 text-primary-light">
        <u>
          <strong>{jsxT('register_know_more')}</strong>
        </u>
      </a>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {blocks(props, t, setValidation, validateRepeat).map(block => (
          <div key={block.title} className="reg-form__block">
            <p className="weight-500 mt-4 mb-3">
              {!!block.title && jsxT(`register_${block.title}`)}
            </p>
            {block.fields.map(field => {
              switch (field.type) {
                case 'checkbox':
                case 'radio': {
                  return (
                    <Form.Check
                      ref={register({
                        required:
                          field.required && t('register_input_required'),
                        setValueAs: value => !!value,
                      })}
                      custom
                      type={field.type}
                      id={field.id}
                      key={field.id}
                      name={field.name || field.id}
                      label={jsxT(`register_input_${field.id}`)}
                      className="mb-4 custom-control-inline"
                      isInvalid={errors[field.id]}
                    />
                  );
                }
                case 'password':
                case 'text': {
                  if (
                    typeof field.autoComplete === 'function' &&
                    field.labelKey
                  ) {
                    return (
                      <AutocompleteTextInput
                        ref={register({
                          required:
                            field.required && t('register_input_required'),
                          validate: field.validate,
                        })}
                        type={field.type}
                        error={errors[field.id]}
                        setError={error =>
                          error
                            ? setError(field.name || field.id, {
                                message: error,
                                type: 'validate',
                              })
                            : clearErrors(field.name || field.id)
                        }
                        labelkey={field.labelKey}
                        autoComplete={field.autoComplete}
                        id={field.id}
                        key={field.id}
                        placeholder={t(`register_input_${field.id}`)}
                        invalidTextError={t(
                          `register_input_${field.id}_invalid`,
                        )}
                      />
                    );
                  }

                  return (
                    <TextInput
                      ref={register({
                        required:
                          field.required && t('register_input_required'),
                        validate: field.validate,
                      })}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      id={field.id}
                      key={field.id}
                      onBlur={() =>
                        field.triggerId && triggerRepeat(field.triggerId)
                      }
                      validation={validationForms[field.id]}
                      error={errors[field.id]}
                      placeholder={t(`register_input_${field.id}`)}
                      toggleVisibility={field.type === 'password'}
                    />
                  );
                }
                case 'date': {
                  return (
                    <TextInput
                      ref={register({
                        required:
                          field.required && t('register_input_required'),
                        valueAsDate: true,
                      })}
                      id={field.id}
                      error={errors[field.id]}
                      type="date"
                      placeholder={t(`register_input_${field.id}`)}
                    />
                  );
                }
              }
            })}
          </div>
        ))}
        {!!apiError && (
          <Alert show={!!apiError} variant="danger">
            {apiError}
          </Alert>
        )}
        <button
          disabled={formState.isSubmitting}
          className="btn btn-primary d-block mx-auto mb-4"
        >
          {formState.isSubmitting && (
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
          {jsxT('register_submit_btn')}
        </button>
      </Form>
    </div>
  );
};

export default OnlineForm;
