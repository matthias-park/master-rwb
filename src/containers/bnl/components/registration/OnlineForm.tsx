import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../../../hooks/useI18n';
import { animateScroll as scroll } from 'react-scroll';
import {
  ValidateRegisterInput,
  ValidateRegisterPersonalCode,
} from '../../../../types/api/user/Registration';
import { useFormContext } from 'react-hook-form';
import { FormFieldValidation, VALIDATIONS } from '../../../../constants';
import { OnlineFormBlock } from '../../../../types/RegistrationBlock';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import {
  RegistrationResponse,
  RegistrationPostalCodeAutofill,
} from '../../../../types/api/user/Registration';
import AutocompleteTextInput from '../../../../components/customFormInputs/AutocompleteTextInput';
import { PostCodeInfo } from '../../../../types/api/user/Registration';
import LoadingButton from '../../../../components/LoadingButton';
import { cache } from 'swr';
import TextInput from '../../../../components/customFormInputs/TextInput';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import { API_VALIDATIONS } from '../../../../utils/apiUtils';
import AutocompletePostalCode from '../AutocompletePostalCode';
interface Props {
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
        id: 'address',
        type: 'text',
        required: true,
      },
      {
        id: 'postal_code',
        required: true,
        type: 'postal_code',
      },
      {
        id: 'phone_number',
        type: 'text',
        required: false,
        validate: value =>
          !value ||
          !value.length ||
          VALIDATIONS.phone(value) ||
          t('phone_number_invalid'),
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
          const res = await API_VALIDATIONS.personalCode(value);
          if (!res?.Success) {
            valid = res?.Message || t('register_personal_code_invalid');
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
          allowEmptyFormatting: true,
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
          const res = await API_VALIDATIONS.email(value);
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
  const [validationForms, setValidationForms] = useState<{
    [key: string]: FormFieldValidation;
  }>({});
  const { handleSubmit, watch, trigger, formState, reset } = useFormContext();

  const setValidation = (id: string, status: FormFieldValidation) =>
    setValidationForms({ ...validationForms, [id]: status });
  const validateRepeat = (id: string, value: string) => {
    return value === watch(id) || t(`register_need_match_${id}`);
  };
  const triggerRepeat = (id: string) => {
    return watch(id, '') !== '' && trigger(id);
  };
  const onSubmit = async ({ postal_code, ...data }) => {
    const post_code = postal_code.split(' ')[0];
    const postal_info = await API_VALIDATIONS.postalCode(post_code);
    const city =
      Object.values(postal_info.Data?.result || {})[0]?.locality_name || '';
    const response = await props.handleRegisterSubmit({
      ...data,
      login: data.email,
      city,
      postal_code: post_code,
    });
    if (!response.Success) {
      scroll.scrollToTop();
    }
    return reset();
  };

  return (
    <div className="reg-form">
      <h1 className="reg-form__title">{jsxT('register_title')}</h1>
      <p className="reg-form__sub-title">{jsxT('register_desc')}</p>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {blocks(props, t, setValidation, validateRepeat).map(block => (
          <div key={block.title} className="reg-form__block">
            <p className="weight-500 mt-4 mb-3">
              {!!block.title && jsxT(`register_${block.title}`)}
            </p>
            {block.fields.map(field => {
              switch (field.type) {
                case 'checkbox': {
                  return (
                    <CheckboxInput
                      id={field.id}
                      key={field.id}
                      title={jsxT(`register_input_${field.id}_label`)}
                      defaultValue={false}
                      rules={{
                        required:
                          field.required &&
                          `${t(`register_input_${field.id}`)} ${t(
                            'register_input_required',
                          )}`,
                      }}
                      className="mb-4"
                    />
                  );
                }
                case 'postal_code': {
                  return (
                    <AutocompletePostalCode
                      id={field.id}
                      key={field.id}
                      onBlur={() => props.fieldChange(field.id)}
                      translationPrefix="register_input_"
                      required={field.required}
                    />
                  );
                }
                case 'number':
                case 'password':
                case 'text':
                case 'email': {
                  return (
                    <TextInput
                      key={field.id}
                      id={field.id}
                      rules={{
                        required:
                          field.required &&
                          `${t(`register_input_${field.id}`)} ${t(
                            'register_input_required',
                          )}`,
                        validate: field.validate,
                      }}
                      disableCopyPaste={field.disableCopyPaste}
                      toggleVisibility={field.type === 'password'}
                      type={field.type}
                      title={t(`register_input_${field.id}`)}
                      tooltip={
                        field.id === 'personal_code'
                          ? t(`tooltip_${field.id}`)
                          : undefined
                      }
                      validation={
                        validationForms[field.id.replace('repeat_', '')] ===
                        FormFieldValidation.Invalid
                          ? FormFieldValidation.Invalid
                          : validationForms[field.id]
                      }
                      onBlur={() => {
                        props.fieldChange(field.id);
                        field.triggerId && triggerRepeat(field.triggerId);
                      }}
                      maskedInput={field.inputFormatting}
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
    </div>
  );
};

export default OnlineForm;
