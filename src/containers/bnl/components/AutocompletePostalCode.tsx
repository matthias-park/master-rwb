import React, { useCallback } from 'react';
import { cache } from 'swr';
import { useI18n } from '../../../hooks/useI18n';
import AutocompleteTextInput from '../../../components/customFormInputs/AutocompleteTextInput';
import { API_VALIDATIONS } from '../../../utils/apiUtils';
import { PostCodeInfo } from '../../../types/api/user/Registration';
import { useFormContext } from 'react-hook-form';

const labelKey = (value: PostCodeInfo, inputValue: string = '') =>
  `${value.zip_code}${/[^-][\s][a-zA-Z]/.test(inputValue) ? '' : ' -'} ${
    value.locality_name
  }`;

interface Props {
  id: string;
  translationPrefix?: string;
  onBlur?: () => void;
  required?: boolean;
  defaultValue?: unknown;
}

const AutocompletePostalCode = ({
  id,
  onBlur,
  translationPrefix = '',
  required,
  defaultValue,
}: Props) => {
  const { register, watch, setValue } = useFormContext();
  const { t } = useI18n();

  const cityValue = watch('city');

  const validate = useCallback(
    async value => {
      if (value?.length && !value.includes(' ') && cityValue)
        value = `${value} - ${cityValue}`;
      console.log(value);
      if (value === defaultValue) return true;
      const postCode = value.split(' ')[0]?.trim();
      const cacheId = `post_code_${postCode}`;
      let response = cache.has(cacheId) && cache.get(cacheId);
      if (!response) {
        response = await API_VALIDATIONS.postalCode(postCode);
        if (response.Success) {
          cache.set(cacheId, response);
        }
      }
      if (response.Fallback) {
        return t('api_response_failed');
      }
      if (
        response.Data?.result?.some(post =>
          [
            `${post.zip_code} - ${post.locality_name}`,
            `${post.zip_code} ${post.locality_name}`,
          ].includes(value),
        )
      )
        return true;
      return t(`${translationPrefix}postal_code_invalid`);
    },
    [t, defaultValue, cityValue],
  );
  const autoComplete = useCallback(
    async value => {
      const postCode = value.split(' ')[0]?.trim();
      const cacheId = `registration_post_code_${postCode}`;
      let response = cache.has(cacheId) && cache.get(cacheId);
      if (!response) {
        response = await API_VALIDATIONS.postalCode(postCode);
        if (response.Success) {
          cache.set(cacheId, response);
        }
      }
      if (!response.Data?.result) {
        throw response.Message || t('register_input_postal_code_invalid');
      }
      return response.Data.result;
    },
    [t],
  );

  const blurHandler = () => {
    const postalCodeValue: string[] = watch(id, '').split(' ');
    if (postalCodeValue.length > 1) {
      const cityValue = postalCodeValue[postalCodeValue.length - 1];
      setValue('city', cityValue);
      setValue(id, postalCodeValue[0]);
    }
    onBlur?.();
  };

  return (
    <>
      <input {...register('city')} style={{ display: 'none' }} />
      <AutocompleteTextInput
        id={id}
        key={id}
        autoComplete={autoComplete}
        invalidTextError={t(`${translationPrefix}${id}_invalid`)}
        labelkey={labelKey}
        title={t(`${translationPrefix}${id}`)}
        defaultValue={defaultValue}
        rules={{
          required:
            required &&
            `${t(`${translationPrefix}${id}`)} ${t(
              `${translationPrefix}required`,
            )}`,
          validate: validate,
        }}
        onBlur={blurHandler}
      />
    </>
  );
};

export default AutocompletePostalCode;
