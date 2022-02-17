import {
  FormFieldValidation,
  franchiseDateFormat,
  RailsApiResponseFallback,
  VALIDATIONS,
  Franchise,
} from '../../../../../constants';
import RailsApiResponse from '../../../../../types/api/RailsApiResponse';
import { API_VALIDATIONS, getApi } from '../../../../../utils/apiUtils';
import dayjs from 'dayjs';
import Province from '../../../../../types/api/Province';
import { OnlineFormBlock } from '../../../../../types/RegistrationBlock';
import * as Sentry from '@sentry/react';

// @ts-ignore
const smartyStreetsEnabled = !!window.__config__.smartyStreets;

export const blocks = (
  t: any,
  setValidation: any,
  validateRepeat: any,
): OnlineFormBlock[] => {
  return [
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
          id: 'gender',
          autoComplete: 'gender',
          type: 'select',
          required: true,
          valueAs: (value: string) => value.toString(),
          selectValues: [
            { text: t('gender_male'), value: 'M' },
            { text: t('gender_female'), value: 'F' },
          ],
        },
        !!smartyStreetsEnabled && {
          id: 'address',
          autoComplete: 'street-address',
          type: 'smartyStreets',
          required: true,
        },
        !smartyStreetsEnabled && {
          id: 'address',
          autoComplete: 'street-address',
          type: 'text',
          required: true,
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
            const url = '/restapi/v1/provinces';
            const res = await getApi<RailsApiResponse<Province | null>>(
              url,
            ).catch(res => {
              Sentry.captureMessage(
                `Request failed ${url} with status ${res.status}`,
                Sentry.Severity.Fatal,
              );
              return RailsApiResponseFallback;
            });
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
        {
          id: 'date_of_birth',
          required: true,
          type: 'text',
          validate: value => {
            if (!value || !VALIDATIONS.validDateFormat(dayjs, value))
              return t('date_of_birth_invalid');
            if (!VALIDATIONS.over_21(dayjs, value))
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
      ],
    },
    {
      title: 'social_security_section',
      description: 'social_security_desc',
      fields: [
        {
          id: 'social_security_number',
          type: 'text',
          required: true,
          validate: value =>
            (!!value && value.length === 4 && !isNaN(parseInt(value))) ||
            t('social_security_invalid'),
          inputFormatting: {
            format: '####',
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
            const valid = VALIDATIONS.password(value, Franchise.gnogaz ? 4 : 3);
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
          checked: true,
        },
        {
          id: 'terms_and_conditions',
          type: 'checkbox',
          required: true,
        },
      ],
    },
  ];
};
