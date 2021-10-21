import React, { useCallback, useMemo } from 'react';
import { SettingsField } from '../../../../types/api/user/ProfileSettings';
import { FormProvider, useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { franchiseDateFormat, VALIDATIONS } from '../../../../constants';
import SelectInput from '../../../../components/customFormInputs/SelectInput';
import TextInput from '../../../../components/customFormInputs/TextInput';
import FileInput from '../../../../components/customFormInputs/FileInput';
import { useAuth } from '../../../../hooks/useAuth';
import { postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useToasts } from 'react-toast-notifications';
import dayjs from 'dayjs';
interface SettingProps {
  id: string;
  fields: SettingsField[];
  action: string;
  fixedData?: { id: string; value?: string | number | undefined }[];
  setResponse?: (
    resp: {
      success: boolean;
      msg: string;
    } | null,
  ) => void;
  mutateData?: () => void;
  translatableDefaultValues?: boolean;
  formBody?: boolean;
  validateBeforeRequest?: (any) => { valid: boolean; message: string };
  formData?: any;
}

const FormsWithUpdateUser = ['deposit_limit', 'identity'];
const formsWithLogoutUser = [
  'permanent_disable',
  'self_exclusion',
  'disable_player_time_out',
  'disable_player',
];
const formLimitsKeys = [
  'limit_amount_day',
  'limit_amount_week',
  'limit_amount_month',
];

const SettingsForm = ({
  id,
  fields,
  action,
  setResponse,
  fixedData,
  mutateData,
  translatableDefaultValues,
  formBody,
  validateBeforeRequest,
  formData,
}: SettingProps) => {
  const { t } = useI18n();
  const { user, updateUser, signout } = useAuth();
  const { addToast } = useToasts();
  const formMethods = useForm<any, any>({
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    watch,
    formState,
    reset,
    register,
    setValue,
    getValues,
  } = formMethods;
  const watchPassword = watch('password');
  const watchAllFields = watch(
    fields
      .filter(
        item =>
          !item.disabled &&
          item.type !== 'submit' &&
          item.id !== 'city' &&
          item.id !== 'image_id_sub_type' &&
          item.type !== 'file',
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
        formBody || false,
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
    body = Object.entries(body).reduce(
      (acc, [k, v]) => (
        !v ? (formLimitsKeys.includes(k) ? (acc[k] = 0) : acc) : (acc[k] = v),
        acc
      ),
      {},
    );
    const checkRequest = validateBeforeRequest && validateBeforeRequest(body);
    if (checkRequest && !checkRequest?.valid) {
      setResponse &&
        setResponse({
          success: checkRequest.valid,
          msg: checkRequest.message,
        });
      return;
    }
    if (fixedData) {
      for (const item of fixedData) {
        if (item.id && item.value) {
          body[item.id] = item.value?.toString();
        }
      }
    }
    for (const field of fields) {
      if (!body[field.id] && field.default)
        body[field.id] = field.default.toString();
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
            {fields.map((field, i) => {
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
                  const isDeleteButton = field.id === 'submit_button_delete';
                  const submitWithCurrentAction =
                    field.value &&
                    getValues(field.value?.id) === field.value?.value;
                  return (
                    <>
                      {field.value && field.value.id && (
                        <input
                          type="hidden"
                          {...register(field.value.id)}
                        ></input>
                      )}

                      <LoadingButton
                        key={field.id}
                        data-testid={field.id}
                        loading={
                          !!formState.isSubmitting &&
                          (!field.value || submitWithCurrentAction)
                        }
                        disabled={
                          field.disabled
                            ? !watchPassword
                            : isDeleteButton
                            ? !formData.some(field => field.LimitAmount != null)
                            : Object.values(watchAllFields).some(
                                value => !value || value === 'default',
                              )
                        }
                        className="mt-2 mr-2"
                        variant="primary"
                        type="submit"
                        onClick={() =>
                          field.value &&
                          setValue(field.value?.id, field.value?.value)
                        }
                      >
                        {t(field.title)}
                      </LoadingButton>
                    </>
                  );
                }
                case 'file': {
                  const fileFields = fields.filter(
                    field => field.type === 'file',
                  );
                  const indexOfFileField = fileFields.findIndex(
                    item => item.id === field.id,
                  );
                  return field.status && field.date ? (
                    <div className="my-3">
                      <h6>{t(field.title)}</h6>
                      <p>
                        {typeof field.status === 'string' && t(field.status)}
                      </p>
                      <p>{field.date}</p>
                      {fileFields[indexOfFileField + 1]?.status &&
                        fileFields[indexOfFileField + 1]?.date && <hr></hr>}
                    </div>
                  ) : (
                    <FileInput
                      key={field.id}
                      id={field.id}
                      disabled={field.disabled}
                      title={t(field.title)}
                    />
                  );
                }
                case 'select': {
                  return (
                    !(
                      i > 0 &&
                      fields[i - 1].type === 'file' &&
                      fields[i - 1].status &&
                      fields[i - 1].date
                    ) && (
                      <SelectInput
                        key={field.id}
                        id={field.id}
                        rules={{
                          required:
                            field.id !== 'image_id_sub_type' &&
                            `${t(field.title)} ${t('settings_field_required')}`,
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
                    )
                  );
                }
                default: {
                  const isPassword = ['password'].includes(field.type);
                  const isNewPassword = [
                    'new_password',
                    'new_password_confirmation',
                  ].includes(field.id);
                  let masketInput;
                  if (field.formatting !== 'none') {
                    if (field.formatting === 'hour') {
                      masketInput = {
                        format: '##:00',
                        mask: 'H',
                        allowEmptyFormatting: true,
                      };
                    } else if (
                      field.formatting === 'currency' ||
                      field.id.includes('amount')
                    ) {
                      masketInput = {
                        prefix: `${user.currency} `,
                        thousandSeparator: true,
                        allowNegative: false,
                      };
                    } else if (field.formatting === 'date') {
                      masketInput = {
                        format: franchiseDateFormat.replace(/[A-Za-z]/g, '#'),
                        mask: franchiseDateFormat
                          .replace(/[^A-Za-z]/g, '')
                          .split(''),
                        allowEmptyFormatting: true,
                        useFormatted: true,
                      };
                    } else if (field.id === 'social_security_number') {
                      if (field.default?.toString().length !== 9) {
                        field.default = '';
                      }
                      masketInput = {
                        format: `###-##-####`,
                        mask: '_',
                        allowEmptyFormatting: true,
                      };
                    }
                  }
                  const isDepositLossBetLimits = [
                    'deposit_limit',
                    'loss_limit',
                    'bet_limit',
                    'session_limit',
                  ].includes(id);
                  return (
                    <TextInput
                      id={field.id}
                      key={field.id}
                      rules={
                        !field.disabled && {
                          required:
                            !isDepositLossBetLimits &&
                            `${t(field.title)} ${t('settings_field_required')}`,
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
                            if (
                              field.id.includes('amount') &&
                              value &&
                              !isNaN(value)
                            ) {
                              const weekValue = watch(
                                field.id.replace('day', 'week'),
                              );
                              const monthValue = watch(
                                field.id.replace('week', 'month'),
                              );

                              if (
                                field.id.includes('day') &&
                                weekValue &&
                                Number(weekValue) < Number(value)
                              )
                                return t('limit_day_over_week');
                              if (
                                field.id.includes('week') &&
                                monthValue &&
                                Number(monthValue) < Number(value)
                              )
                                return t('limit_week_over_month');
                            }
                            if (
                              ['first_name', 'last_name'].includes(field.id)
                            ) {
                              return (
                                VALIDATIONS.name(value) ||
                                t('field_only_letters')
                              );
                            }
                            if (field.id === 'date_of_birth') {
                              if (
                                !value ||
                                !VALIDATIONS.validDateFormat(dayjs, value)
                              ) {
                                return t('date_of_birth_invalid');
                              }
                              return (
                                VALIDATIONS.over_21(dayjs, value) ||
                                t('date_of_birth_below_21')
                              );
                            }
                            if (field.id === 'social_security_number') {
                              return (
                                (value.length === 9 &&
                                  !isNaN(parseInt(value))) ||
                                t('full_social_security_invalid')
                              );
                            }
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
