import React, { useCallback, useMemo } from 'react';
import { SettingsField } from '../../../../types/api/user/ProfileSettings';
import { FormProvider, useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { REGEX_EXPRESSION, VALIDATIONS } from '../../../../constants';
import SelectInput from '../../../../components/customFormInputs/SelectInput';
import TextInput from '../../../../components/customFormInputs/TextInput';
import { useAuth } from '../../../../hooks/useAuth';
import { postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useToasts } from 'react-toast-notifications';
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
  translatableDefaultValues?: boolean;
}

const FormsWithUpdateUser = ['deposit_limit'];
const formsWithLogoutUser = [
  'permanent_disable',
  'self_exclusion',
  'disable_player_time_out',
  'disable_player',
];

const SettingsForm = ({
  id,
  fields,
  action,
  setResponse,
  fixedData,
  mutateData,
  translatableDefaultValues,
}: SettingProps) => {
  const { t } = useI18n();
  const { user, updateUser, signout } = useAuth();
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
    .filter(field => !field.default && field.type !== 'submit')
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
    data =>
      onSubmit(
        action,
        data,
        false,
        FormsWithUpdateUser.includes(id),
        formsWithLogoutUser.includes(id),
      ),
    [],
  );

  const onSubmit = async (
    url: string,
    body: { [key: string]: string | Blob },
    formBody: boolean = false,
    shouldUpdateUser: boolean = false,
    shouldLogoutUser: boolean = false,
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
    if (shouldUpdateUser || shouldLogoutUser) {
      if (shouldLogoutUser && res.Success) {
        signout();
      } else {
        updateUser();
      }
    }
    return;
  };

  const showHiddenUsernameField = fields.some(field => field.id === 'password');

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(updateSettingsSubmit)}>
        <div className="row pt-3">
          <div data-testid="form-container" className="col-12">
            {showHiddenUsernameField && (
              <input
                id="username"
                name="username"
                style={{ display: 'none' }}
                type="text"
              />
            )}
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
                      disabled={
                        field.disabled ||
                        Object.values(watchAllFields).some(
                          value => !value || value === 'default',
                        )
                      }
                      className="mt-2"
                      variant="primary"
                      type="submit"
                    >
                      {t(field.title)}
                    </LoadingButton>
                  );
                }
                case 'select': {
                  return (
                    <SelectInput
                      key={field.id}
                      id={field.id}
                      rules={{
                        required: `${t(field.title)} ${t(
                          'settings_field_required',
                        )}`,
                      }}
                      disabled={field.disabled}
                      defaultValue={field.default}
                      values={
                        field.values?.map(option => ({
                          value: option.id,
                          text: t(option.title),
                        })) || []
                      }
                      title={t(field.title)}
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
                        key={defaultValue || field.id}
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
                  let masketInput;
                  if (field.id.includes('amount')) {
                    masketInput = {
                      prefix: `${user.currency} `,
                      thousandSeparator: true,
                      allowNegative: false,
                    };
                  }
                  return (
                    <TextInput
                      id={field.id}
                      key={field.id}
                      rules={
                        !field.disabled && {
                          required: `${t(field.title)} ${t(
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
                      defaultValue={
                        field.default && translatableDefaultValues
                          ? t(field.default.toString())
                          : field.default
                      }
                      maskedInput={masketInput}
                      disabled={field.disabled}
                      title={t(field.title)}
                      toggleVisibility={isPassword}
                      type={field.type}
                      autoComplete={
                        isPassword
                          ? `${isNewPassword ? 'new' : 'current'}-password`
                          : 'nope'
                      }
                      disableCopyPaste={isPassword || isNewPassword}
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
