import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useI18n } from '../../../../hooks/useI18n';
import { animateScroll as scroll } from 'react-scroll';
import { useFormContext } from 'react-hook-form';
import { FormFieldValidation, VALIDATIONS } from '../../../../constants';
import { OnlineFormBlock } from '../../../../types/RegistrationBlock';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import LoadingButton from '../../../../components/LoadingButton';
import TextInput from '../../../../components/customFormInputs/TextInput';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import { API_VALIDATIONS } from '../../../../utils/apiUtils';
import AutocompletePostalCode from '../AutocompletePostalCode';
import clsx from 'clsx';
import { NET_USER } from '../../../../types/UserStatus';
interface Props {
  handleRegisterSubmit: (
    form: any,
  ) => Promise<RailsApiResponse<NET_USER | null>>;
  fieldChange: (fieldName: string) => void;
}

const blocks = (
  t: any,
  setValidation: any,
  validateRepeat: any,
): OnlineFormBlock[] => [
  {
    title: 'personal_info',
    fields: [
      {
        id: 'firstname',
        autoComplete: 'given-name',
        type: 'text',
        required: true,
        validate: value => VALIDATIONS.name(value) || t('field_only_letters'),
      },
      {
        id: 'lastname',
        autoComplete: 'family-name',
        type: 'text',
        required: true,
        validate: value => VALIDATIONS.name(value) || t('field_only_letters'),
      },
      {
        id: 'address',
        autoComplete: 'street-address',
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
        autoComplete: 'tel',
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
    description: 'over_18_desc',
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
        autoComplete: 'email',
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
        autoComplete: 'email',
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
    description: 'password_desc',
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
        autoComplete: 'new-password',
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
    setValidationForms(prev => ({ ...prev, [id]: status }));
  const validateRepeat = (id: string, value: string) => {
    const isEqual =
      id === 'email'
        ? value.toLocaleLowerCase() === watch(id, '').toLocaleLowerCase()
        : value === watch(id, '');
    return isEqual || t(`register_need_match_${id}`);
  };
  const triggerRepeat = (id: string) => {
    return watch(id, '') !== '' && trigger(id);
  };
  const onSubmit = async data => {
    const response = await props.handleRegisterSubmit({
      ...data,
      login: data.email,
    });
    if (!response.Success) {
      scroll.scrollToTop();
    }
    return reset();
  };
  const fields = blocks(t, setValidation, validateRepeat);

  return (
    <div className="reg-form">
      <h1 className="reg-form__title">{jsxT('register_title')}</h1>
      <p className="reg-form__sub-title">{jsxT('register_desc')}</p>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {fields.map(block => (
          <div key={block.title} className="reg-form__block">
            <p
              className={clsx('weight-500 mt-4', !block.description && 'mb-3')}
            >
              {!!block.title && jsxT(`register_${block.title}`)}
            </p>
            {!!block.description && (
              <p className="mb-3">{jsxT(`register_${block.description}`)}</p>
            )}
            {block.fields.map(field => {
              if (!field) return null;
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
                      autoComplete={field.autoComplete}
                      validation={
                        (validationForms[field.id.replace('repeat_', '')] ===
                          FormFieldValidation.Invalid ||
                          validationForms[`repeat_${field.id}`] ===
                            FormFieldValidation.Invalid) &&
                        validationForms[field.id] !==
                          FormFieldValidation.Validating
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
