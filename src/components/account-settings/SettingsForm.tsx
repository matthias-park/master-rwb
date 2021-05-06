import React, { useCallback, useContext, useMemo, useState } from 'react';
import { SettingsField } from '../../types/api/user/ProfileSettings';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../LoadingButton';
import { useI18n } from '../../hooks/useI18n';
import { VALIDATIONS } from '../../constants';
import SelectInput from '../customFormInputs/SelectInput';
import TextInput from '../customFormInputs/TextInput';
import { useAuth } from '../../hooks/useAuth';
import { postApi } from '../../utils/apiUtils';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { useToasts } from 'react-toast-notifications';
import useApi from '../../hooks/useApi';
import ProfileSettings from '../../types/api/user/ProfileSettings';

interface SettingProps {
  id: string;
  fields: SettingsField[];
  action: string;
}

const FormsWithUpdateUser = [
  'disable_player',
  'disable_player_time_out',
  'permanent_disable',
];

const SettingsForm = ({ id, fields, action }: SettingProps) => {
  const { t } = useI18n();
  const { user, updateUser } = useAuth();
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    msg: string;
  } | null>(null);
  const { addToast } = useToasts();
  const formMethods = useForm<any, any>({
    mode: 'onBlur',
  });
  const { data, error, mutate } = useApi<ProfileSettings>(
    '/railsapi/v1/user/profile',
    {
      onErrorRetry: (error, key) => {
        addToast(`Failed to fetch user settings`, {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(error);
      },
    },
  );
  const { handleSubmit, watch, formState } = formMethods;
  const watchAllFields = watch();
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
    setApiResponse(null);
    body.authenticity_token = user.token!;
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
    setApiResponse({
      success: res.Success,
      msg: res.Message || t('api_response_failed'),
    });
    setTimeout(() => mutate(), 1000);
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
              switch (field.id) {
                case 'submit_button': {
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
                  const isPassword = [
                    'new_password',
                    'new_password_confirmation',
                  ].includes(field.id);
                  return (
                    <TextInput
                      id={field.id}
                      rules={{
                        required: `${field.title} ${t(
                          'settings_field_required',
                        )}`,
                        validate: value => {
                          if (isPassword)
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
                      }}
                      defaultValue={field.default}
                      disabled={field.disabled}
                      title={field.title}
                      toggleVisibility={isPassword}
                      type={field.type}
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
