import React, { useCallback, useContext, useMemo, useState } from 'react';
import { SettingsField } from '../../../../types/api/user/ProfileSettings';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { REGEX_EXPRESSION, VALIDATIONS } from '../../../../constants';
import SelectInput from '../../../../components/customFormInputs/SelectInput';
import TextInput from '../../../../components/customFormInputs/TextInput';
import { useAuth } from '../../../../hooks/useAuth';
import { API_VALIDATIONS, postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../../../hooks/useApi';
import ProfileSettings from '../../../../types/api/user/ProfileSettings';
import AutocompletePostalCode from '../AutocompletePostalCode';

interface SettingProps {
  id: string;
  fields: SettingsField[];
  action: string;
  fixedData?: { id: string; value?: number | string | undefined }[];
  setResponse?: (
    resp: {
      success: boolean;
      msg: string;
    } | null,
  ) => void;
  mutateData?: () => void;
}

const FormsWithUpdateUser = [
  'deposit_limit',
  'disable_player',
  'disable_player_time_out',
  'permanent_disable',
];

const SettingsForm = ({
  id,
  fields,
  action,
  setResponse,
  fixedData,
  mutateData,
}: SettingProps) => {
  const { t } = useI18n();
  const { user, updateUser } = useAuth();
  const { addToast } = useToasts();
  const formMethods = useForm<any, any>({
    mode: 'onBlur',
  });
  const { handleSubmit, watch, formState, reset } = formMethods;
  const watchAllFields = watch(
    fields
      .filter(
        item => !item.disabled && item.type !== 'submit' && item.id !== 'city',
      )
      .map(field => field.id),
  );
  const resetValues = fields
    .filter(field => !field.default && field.type != 'submit')
    .map(field => field.id);
  const visibilityOverrideFields = useMemo(
    () =>
      fields
        .filter(
          field =>
            field.type === 'select' &&
            field.values?.some(value => value.additional_fields),
        )
        .reduce((obj, field) => {
          for (const value of field.values || []) {
            if (value.additional_fields) {
              for (const additionalField of value.additional_fields) {
                if (!obj[additionalField]) obj[additionalField] = {};
                if (!obj[additionalField][field.id])
                  obj[additionalField][field.id] = [];

                obj[additionalField][field.id].push(value.id.toString());
              }
            }
          }

          return obj;
        }, {}),
    [fields],
  );

  const updateSettingsSubmit = useCallback(
    data => onSubmit(action, data, false, FormsWithUpdateUser.includes(id)),
    [],
  );

  const onSubmit = async (
    url: string,
    body: { [key: string]: string | Blob },
    formBody: boolean = false,
    shouldUpdateUser: boolean = false,
  ): Promise<void> => {
    setResponse && setResponse(null);
    body.authenticity_token = user.token!;
    if (fixedData) {
      for (const item of fixedData) {
        if (item.id && item.value) {
          body[item.id] = item.value?.toString();
        }
        if ('phone_number' === item.id && body[item.id]) {
          body[item.id] = (body[item.id] as string).replace(
            REGEX_EXPRESSION.PHONE_NUMBER_NORMALIZE,
            '',
          );
        }
        if ('postal_code' === item.id && body[item.id]) {
          body[item.id] = (body[item.id] as string).split(' ')[0];
          const post_code = (body[item.id] as string).split(' ')[0];
          const postal_info = await API_VALIDATIONS.postalCode(post_code);
          const city =
            Object.values(postal_info.Data?.result || {})[0]?.locality_name ||
            '';
          body['postal_code'] = post_code;
          body['city'] = city;
        }
      }
    }
    const res = await postApi<RailsApiResponse<null>>(url, body, {
      formData: formBody,
    }).catch((res: RailsApiResponse<null>) => {
      if (res.Fallback) {
        addToast(`Failed to update user settings`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      return res;
    });
    setResponse &&
      setResponse({
        success: res.Success,
        msg: res.Message || t('api_response_failed'),
      });
    if (res.Success) {
      reset(null, { keepValues: true });
      resetValues.forEach(id => formMethods.setValue(id, ''));
    }
    mutateData && setTimeout(() => mutateData(), 1000);
    if (shouldUpdateUser) {
      updateUser();
    }
    return;
  };

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(updateSettingsSubmit)}>
        <div className="row pt-3">
          <div data-testid="form-container" className="col-12">
            {fields.map(field => {
              const visibilityOverrideField =
                visibilityOverrideFields[field.id];
              const visibilityOverride =
                visibilityOverrideField &&
                Object.keys(visibilityOverrideField).some(key =>
                  visibilityOverrideField[key].includes(watchAllFields[key]),
                );
              if (!(field.visible ?? true) && !(visibilityOverride ?? false)) {
                return null;
              }
              switch (field.type) {
                case 'submit': {
                  return (
                    <LoadingButton
                      key={field.id}
                      data-testid={field.id}
                      loading={!!formState.isSubmitting}
                      disabled={Object.values(watchAllFields).some(
                        value => !value || value === 'default',
                      )}
                      className="mt-2"
                      variant="primary"
                      type="submit"
                    >
                      {field.title}
                    </LoadingButton>
                  );
                }
                case 'select': {
                  return (
                    <SelectInput
                      key={field.id}
                      id={field.id}
                      rules={{
                        required: `${field.title} ${t(
                          'settings_field_required',
                        )}`,
                      }}
                      disabled={field.disabled}
                      defaultValue={field.default}
                      values={
                        field.values?.map(option => ({
                          value: option.id,
                          text: option.title,
                        })) || []
                      }
                      title={field.title}
                    />
                  );
                }
                default: {
                  if (field.id === 'city') return null;
                  if (field.id === 'postal_code') {
                    const cityField = fields.find(item => item.id === 'city');
                    let defaultValue = field.default
                      ? field.default.toString()
                      : '';
                    if (cityField?.default) {
                      defaultValue += ` - ${cityField.default}`;
                    }
                    return (
                      <AutocompletePostalCode
                        id={field.id}
                        key={field.id}
                        defaultValue={defaultValue}
                        translationPrefix="settings_field_"
                        required
                      />
                    );
                  }
                  const isPassword = ['password'].includes(field.type);
                  const isNewPassword = [
                    'new_password',
                    'new_password_confirmation',
                  ].includes(field.id);
                  return field.id === 'postal_code' ? (
                    <AutocompletePostalCode
                      id={field.id}
                      defaultValue={field.default}
                    />
                  ) : (
                    <TextInput
                      id={field.id}
                      rules={
                        !field.disabled && {
                          required: `${field.title} ${t(
                            'settings_field_required',
                          )}`,
                          validate: value => {
                            if (isNewPassword)
                              return (
                                VALIDATIONS.passwordMixOfThree(value) ||
                                t('register_password_weak')
                              );
                            if (field.id === 'phone_number')
                              return (
                                VALIDATIONS.phone(value) ||
                                t('phone_number_invalid')
                              );
                            return true;
                          },
                        }
                      }
                      defaultValue={field.default}
                      disabled={field.disabled}
                      title={field.title}
                      toggleVisibility={isPassword}
                      type={field.type}
                      autoComplete="off"
                    />
                  );
                }
              }
            })}
          </div>
        </div>
      </Form>
    </FormProvider>
  );
};

export default SettingsForm;
