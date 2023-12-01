import {
  FormFieldValidation,
  franchiseDateFormat,
  VALIDATIONS,
} from '../../../../../constants';
import { API_VALIDATIONS, getApi } from '../../../../../utils/apiUtils';
import dayjs from 'dayjs';
import Province from '../../../../../types/api/Province';
import RailsApiResponse from '../../../../../types/api/RailsApiResponse';

// @ts-ignore
const smartyStreetsEnabled = !!window.__config__.smartyStreets;

export const blocks = (t: any, setValidation: any, validateRepeat: any) => {
  return [
    [
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
              valid =
                res?.Success || res?.Message || t('register_already_taken');
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
            id: 'password',
            type: 'validation_checklist_input',
            validationChecklist: {
              eightChar: /^.{8,}$/,
              oneSpecChar: /^.*[^A-Za-z0-9].*$/,
              oneLowerCase: /^.*[a-z].*$/,
              oneCapChar: /^.*[A-Z].*$/,
              oneNumber: /^.*[0-9].*$/,
            },
            disableCopyPaste: true,
            autoComplete: 'new-password',
            triggerId: 'repeat_password',
            required: true,
            validate: value => {
              const valid = VALIDATIONS.password(value);
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
    ],
    [
      {
        title: 'personal_info',
        fields: [
          {
            id: 'firstname',
            autoComplete: 'given-name',
            type: 'text',
            required: true,
            validate: value =>
              VALIDATIONS.name(value) || t('field_only_letters'),
          },
          {
            id: 'middlename',
            autoComplete: 'given-name',
            type: 'text',
            required: false,
            validate: value => {
              if (!value) return true;
              return VALIDATIONS.name(value) || t('field_only_letters');
            },
          },
          {
            id: 'lastname',
            autoComplete: 'family-name',
            type: 'text',
            required: true,
            validate: value =>
              VALIDATIONS.name(value) || t('field_only_letters'),
          },
          {
            id: 'date_of_birth',
            required: true,
            type: 'text',
            validate: value => {
              if (!value || !VALIDATIONS.validDateFormat(dayjs, value))
                return t('date_of_birth_invalid');
              if (!VALIDATIONS.overApprovedAge(dayjs, value, 21))
                return t('date_of_birth_below_21');
              return true;
            },
            inputFormatting: {
              format: franchiseDateFormat.replace(/[A-Za-z]/g, '#'),
              mask: franchiseDateFormat.replace(/[^A-Za-z]/g, '').split(''),
              allowEmptyFormatting: true,
              useFormatted: true,
            },
          },
          {
            id: 'social_security_number',
            type: 'text',
            required: true,
            inputFormatting: {
              format: '####',
              mask: '####'.replace(/[^1-9]/g, '').split(''),
              useFormatted: false,
            },
            validate: value =>
              VALIDATIONS.exactLengh({ value: value, exactLength: 4 }) ||
              t('social_security_invalid'),
          },
          {
            id: 'phone_number',
            autoComplete: 'tel',
            type: 'text',
            required: true,
            validate: value =>
              !value ||
              !value.length ||
              VALIDATIONS.phone(value) ||
              t('phone_number_invalid'),
            inputFormatting: {
              format: '(###) ###-####',
              mask: '(###) ###-####'.replace(/[^1-9]/g, '').split(''),
              useFormatted: false,
            },
          },
          {
            id: 'multifactor_required',
            type: 'checkbox',
            required: true,
            checked: true,
          },
        ],
      },
    ],
    [
      {
        fields: [
          !!smartyStreetsEnabled && {
            type: 'smartyStreets',
            items: [
              {
                id: 'address',
                autoComplete: 'street-address',
                type: 'smartyStreets',
                required: true,
                expandable: true,
                validate: value => {
                  if (!VALIDATIONS.isNotPoBox(value)) {
                    return t('register_pobox_invalid');
                  }
                  if (!VALIDATIONS.lengthLimitation(value, 2, 42)) {
                    return `${t('register_input_address')} ${t(
                      'address_field_invalid',
                    )}`;
                  }
                },
              },
              {
                id: 'city',
                autoComplete: 'address-level2',
                type: 'text',
                required: true,
                validate: value =>
                  VALIDATIONS.city(value) || t('register_city_invalid'),
              },
              {
                id: 'province_id',
                autoComplete: 'address-level1',
                type: 'select',
                required: true,
                valueAs: (value: string) => value.toString(),
                selectValues: async () => {
                  const res = await getApi<RailsApiResponse<Province | null>>(
                    '/restapi/v1/provinces',
                  ).catch(err => err);
                  if (res.Success && res.Data && Array.isArray(res.Data)) {
                    return res.Data.map(province => ({
                      text: province.name,
                      value: province.id.toString(),
                    }));
                  }
                  return [];
                },
              },
              {
                id: 'postal_code',
                required: true,
                validate: value =>
                  VALIDATIONS.usa_post_code(value) || t('post_code_invalid'),
                type: 'text',
              },
            ],
          },
          {
            id: 'newsletter',
            type: 'checkbox',
            checked: true,
          },
          {
            id: 'info_accuracy_check',
            type: 'checkbox',
            required: true,
          },
          {
            id: 'over_21_confirm',
            type: 'checkbox',
            required: true,
          },
          {
            id: 'account_info_private',
            type: 'checkbox',
            required: true,
          },
          {
            id: 'not_blacklisted_player',
            type: 'checkbox',
            required: true,
          },
          {
            id: 'not_a_key_employee',
            type: 'checkbox',
            required: true,
          },
          {
            id: 'terms_and_conditions',
            type: 'checkbox',
            required: true,
          },
        ],
      },
    ],
  ];
};
