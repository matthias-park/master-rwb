import { ControlledTextInput } from '../TextInput';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../hooks/useI18n';
import { animateScroll as scroll } from 'react-scroll';
import {
  ValidateRegisterInput,
  ValidateRegisterPersonalCode,
} from '../../types/api/user/Registration';
import { FormProvider, useForm } from 'react-hook-form';
import { FormFieldValidation, VALIDATIONS } from '../../constants';
import { OnlineFormBlock } from '../../types/RegistrationBlock';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import {
  RegistrationResponse,
  RegistrationPostalCodeAutofill,
} from '../../types/api/user/Registration';
import AutocompleteTextInput from '../AutocompleteTextInput';
import { PostCodeInfo } from '../../types/api/user/Registration';
import LoadingButton from '../LoadingButton';
import RegError from './RegError';

interface Props {
  checkEmailAvailable: (email: string) => Promise<ValidateRegisterInput | null>;
  checkPersonalCode: (
    personalCode: string,
  ) => Promise<RailsApiResponse<ValidateRegisterPersonalCode | null>>;
  checkPostalCode: (
    postCode: string,
  ) => Promise<RailsApiResponse<RegistrationPostalCodeAutofill | null>>;
  handleRegisterSubmit: (
    form: any,
  ) => Promise<RailsApiResponse<RegistrationResponse | null>>;
  fieldChange: (fieldName: string) => void;
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
        id: 'firstname',
        type: 'text',
        required: true,
        validate: value => VALIDATIONS.name(value) || t('field_only_letters'),
      },
      {
        id: 'lastname',
        type: 'text',
        required: true,
        validate: value => VALIDATIONS.name(value) || t('field_only_letters'),
      },
      {
        id: 'street',
        type: 'text',
        required: true,
      },
      {
        id: 'postal_code',
        required: true,
        type: 'text',
        validate: value =>
          (/^(?:(?:[1-9])(?:\d{3}))$/.test(value.split(' - ')[0]) &&
            value.split(' - ').length === 2) ||
          t('register_input_postal_code_invalid'),
        labelKey: (value: PostCodeInfo) =>
          `${value.zip_code} - ${value.locality}`,
        autoComplete: async value => {
          const postCode = value.split(' - ')[0];
          const res = await props.checkPostalCode(postCode);
          if (!res.Data?.result) {
            throw res.Message || t('register_input_postal_code_invalid');
          }
          return res.Data.result;
        },
      },
      {
        id: 'phone_number',
        type: 'text',
        required: false,
        inputFormatting: {
          format: value => {
            // if(/^\+32/.test(value)) {
            //   if (value)
            // }
            return '+32 #########';
          },
        },
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
        inputFormatting: {
          format: '##.##.##-###.##',
          mask: '_',
          placeholder: '_',
        },
      },
    ],
  },
  {
    title: 'email_section',
    fields: [
      {
        id: 'email',
        type: 'email',
        required: true,
        disableCopyPaste: true,
        triggerId: 'repeat_email',
        validate: async value => {
          let valid: string | boolean = true;
          setValidation('email', FormFieldValidation.Validating);
          if (!VALIDATIONS.email(value)) {
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
        type: 'email',
        required: true,
        disableCopyPaste: true,
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
        disableCopyPaste: true,
        autoComplete: 'new-password',
        triggerId: 'repeat_password',
        required: true,
        validate: value => {
          const valid = VALIDATIONS.passwordMixOfThree(value);
          setValidation(
            'password',
            valid ? FormFieldValidation.Valid : FormFieldValidation.Invalid,
          );
          return valid || t('register_password_weak');
        },
      },
      {
        id: 'repeat_password',
        required: true,
        type: 'password',
        disableCopyPaste: true,
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
  const formMethods = useForm({
    mode: 'onBlur',
  });
  const {
    register,
    handleSubmit,
    errors,
    watch,
    trigger,
    formState,
    setError,
    clearErrors,
  } = formMethods;

  const setValidation = (id: string, status: FormFieldValidation) =>
    setValidationForms({ ...validationForms, [id]: status });
  const validateRepeat = (id: string, value: string) => {
    return value === watch(id) || t(`register_need_match_${id}`);
  };
  const triggerRepeat = (id: string) => {
    return watch(id, '') !== '' && trigger(id);
  };
  const onSubmit = async ({ terms_and_conditions, postal_code, ...data }) => {
    const post_code = postal_code.split(' - ')[0];
    const postal_info = await props.checkPostalCode(post_code);
    //add formatting prefix
    const phone_number = `+32${data.phone_number}`;
    const city =
      Object.values(postal_info.Data?.result || {})[0]?.locality || '';
    const response = await props.handleRegisterSubmit({
      ...data,
      login: data.email,
      city,
      postal_code: post_code,
      phone_number,
    });
    if (!response.Success) {
      scroll.scrollToTop();
      return setApiError(response.Message);
    }
    return setApiError(null);
  };

  return (
    <div className="reg-form">
      {apiError ? (
        <RegError errMsg={apiError} onClose={setApiError} />
      ) : (
        <>
          <h1 className="reg-form__title">{jsxT('register_title')}</h1>
          <p className="reg-form__sub-title">{jsxT('register_desc')}</p>
          <FormProvider {...formMethods}>
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
                      case 'number':
                      case 'password':
                      case 'text':
                      case 'email': {
                        if (
                          typeof field.autoComplete === 'function' &&
                          field.labelKey
                        ) {
                          return (
                            <AutocompleteTextInput
                              rules={{
                                required:
                                  field.required &&
                                  t('register_input_required'),
                                validate: field.validate,
                              }}
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
                              onBlur={() => props.fieldChange(field.id)}
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
                          <ControlledTextInput
                            rules={{
                              required:
                                field.required && t('register_input_required'),
                              validate: field.validate,
                            }}
                            type={field.type}
                            autoComplete={field.autoComplete}
                            id={field.id}
                            key={field.id}
                            onBlur={() => {
                              props.fieldChange(field.id);
                              field.triggerId && triggerRepeat(field.triggerId);
                            }}
                            disableCopyPaste={field.disableCopyPaste}
                            validation={validationForms[field.id]}
                            error={errors[field.id]}
                            placeholder={t(`register_input_${field.id}`)}
                            toggleVisibility={field.type === 'password'}
                            inputFormatting={field.inputFormatting}
                          />
                        );
                      }
                      case 'date': {
                        return (
                          <ControlledTextInput
                            rules={register({
                              required:
                                field.required && t('register_input_required'),
                              valueAsDate: true,
                            })}
                            id={field.id}
                            error={errors[field.id]}
                            type="date"
                            onBlur={() => props.fieldChange(field.id)}
                            placeholder={t(`register_input_${field.id}`)}
                            inputFormatting={field.inputFormatting}
                          />
                        );
                      }
                      default:
                        return null;
                    }
                  })}
                </div>
              ))}
              <LoadingButton
                loading={formState.isSubmitting}
                type="submit"
                className="btn btn-primary d-block mx-auto mb-4"
              >
                {jsxT('register_submit_btn')}
              </LoadingButton>
            </Form>
          </FormProvider>
        </>
      )}
    </div>
  );
};

export default OnlineForm;
