import React, { useCallback, useMemo } from 'react';
import { SettingsField } from '../../../../types/api/user/ProfileSettings';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../../../../components/LoadingButton';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import { useI18n } from '../../../../hooks/useI18n';
import {
  franchiseDateFormat,
  VALIDATIONS,
  usaOnlyBrand,
  ThemeSettings,
} from '../../../../constants';
import SelectInput from '../../../../components/customFormInputs/SelectInput';
import TextInput from '../../../../components/customFormInputs/TextInput';
import FileInput from '../../../../components/customFormInputs/FileInput';
import { useAuth } from '../../../../hooks/useAuth';
import { postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import clsx from 'clsx';
import { getApi } from '../../../../utils/apiUtils';
import { injectTrackerScript } from '../../../../utils/uiUtils';
import Link from '../../../../components/Link';

dayjs.extend(utc);

interface SettingProps {
  id: string;
  fields?: SettingsField[];
  fieldsFromBlocks?: SettingsField[];
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
  allowSubmit?: (any) => boolean;
  formData?: any;
  blocks?: {
    items: {
      title?: string;
      fields: SettingsField[];
    }[];
    className?: string;
    titleClassName?: string;
  };
  formDisabled?: boolean;
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

const FormFields = ({
  id,
  fields = [],
  fieldsFromBlocks,
  allowSubmit,
  formData,
  translatableDefaultValues,
  formDisabled,
}: SettingProps) => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const { icons: icon } = ThemeSettings!;
  const showHiddenUsernameField = fields?.some(
    field => field.id === 'password',
  );
  const {
    watch,
    formState,
    register,
    setValue,
    getValues,
    trigger,
  } = useFormContext();
  const watchPassword = watch('password');
  const watchExcludePassword = watch(
    (fieldsFromBlocks || fields)
      .filter(
        field =>
          !field.id.includes('password') &&
          !field.id.includes('submit') &&
          !field.disabled,
      )
      .map(field => field.id),
  );
  const watchAllFields = watch(
    (fieldsFromBlocks || fields)
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

  const defaultValues = (fieldsFromBlocks || fields)
    .filter(
      field =>
        !field.id.includes('password') &&
        !field.id.includes('submit') &&
        !field.disabled,
    )
    .map(field => {
      return field.default;
    });

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

  const formatTime = (durationInMinutes: number) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    const hoursString =
      hours > 0 ? `${hours} ${hours === 1 ? t('hour') : t('hours')}` : '';
    const minutesString =
      minutes > 0
        ? `${minutes} ${minutes === 1 ? t('minute') : t('minutes')}`
        : '';

    // Combine hours and minutes with the proper spacing
    const formattedTime = [hoursString, minutesString]
      .filter(Boolean)
      .join(' ');

    return formattedTime;
  };
  const formattedRemainingLimit = (field: SettingsField) => {
    if (formData.length === 0) return null;
    const matchingData = formData.find(
      data => field?.id && field.id.includes(data.LimitType.toLowerCase()),
    );

    if (!matchingData) return null;

    switch (matchingData.Formatting) {
      case 'currency':
        return (
          matchingData?.AmountLeft && user.currency + matchingData.AmountLeft
        );

      case 'hour':
        const remainMinutes =
          (matchingData?.LimitAmount ?? 0) * 60 -
          (matchingData?.AccumulatedDuration ?? 0);
        return remainMinutes && formatTime(remainMinutes);

      case 'date':
        return (
          matchingData?.AmountLeft &&
          matchingData.AmountLeft + t('limits_dates')
        );

      default:
        return (
          matchingData?.AmountLeft ||
          matchingData?.FutureLimitAmount ||
          matchingData?.AccumulatedDuration
        );
    }
  };

  const formattedRequestedLimit = (
    field: SettingsField,
    limit: any,
    fieldName: string,
  ) => {
    if (formData.length === 0 && limit) {
      switch (id) {
        case 'session_limit': {
          return limit + t('limits_hours');
        }
        default: {
          return user.currency + limit;
        }
      }
    }
    const matchingData = formData.find(
      data => field?.id && field.id.includes(data.LimitType.toLowerCase()),
    );

    if (!matchingData) return null;

    const fieldData = matchingData[fieldName];

    switch (matchingData.Formatting) {
      case 'currency':
        return fieldData && user.currency + fieldData;
      case 'hour':
        return fieldData && fieldData + t('limits_hours');
      case 'date':
        return fieldData && fieldData + t('limits_dates');
      default:
        return fieldData && fieldData;
    }
  };

  const foramttedValidDate = (field: SettingsField, fieldName: string) => {
    if (formData.length === 0) return ' ';
    for (let data of formData) {
      const fieldData = data[fieldName];
      if (
        field?.id &&
        field.id.includes(data.LimitType.toLowerCase()) &&
        data.FutureLimitValidFrom
      ) {
        return dayjs
          .utc(fieldData)
          .local()
          .format(franchiseDateFormat + ' HH:mm');
      }
    }
  };

  const isLimitForm = fields =>
    fields.some(
      obj =>
        ('id' in obj && obj.id?.includes('limit')) ||
        ('title' in obj && obj.title?.includes('limit')),
    );

  return (
    <div className="row">
      <div data-testid="form-container" className="w-100 px-3 pt-3">
        {showHiddenUsernameField && (
          <input
            id="username"
            name="username"
            style={{ display: 'none' }}
            type="text"
          />
        )}
        {fields.map((field, i) => {
          const visibilityOverrideField = visibilityOverrideFields[field.id];
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
              let isDisabled = false;
              if (field.disabled || formDisabled) {
                isDisabled = !watchPassword;
              } else if (isDeleteButton) {
                isDisabled = !formData.some(field => field.LimitAmount != null);
              } else if (isDeleteButton) {
                isDisabled = !formData.some(field => field.LimitAmount != null);
              } else if (isLimitForm(fields)) {
                isDisabled = !formState.isDirty;
              } else if (allowSubmit) {
                isDisabled = !allowSubmit(watch());
              } else if (
                formState.isDirty &&
                !!watchPassword &&
                !!watchExcludePassword.length
              ) {
                isDisabled = !watchExcludePassword.some(
                  field => !(defaultValues.includes(field) || field === '-1'),
                );
              } else {
                isDisabled = Object.values(watchAllFields).some(
                  value => !value || value === 'default' || value === '-1',
                );
              }
              return (
                <>
                  {field.value && field.value.id && (
                    <input type="hidden" {...register(field.value.id)}></input>
                  )}
                  <LoadingButton
                    key={field.id}
                    data-testid={field.id}
                    loading={
                      !!formState.isSubmitting &&
                      (!field.value || submitWithCurrentAction)
                    }
                    disabled={isDisabled}
                    className="mt-2 mr-2"
                    variant={isDeleteButton ? 'secondary' : 'primary'}
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
              const fileFields = fields.filter(field => field.type === 'file');
              const indexOfFileField = fileFields.findIndex(
                item => item.id === field.id,
              );
              return field.status && field.date ? (
                <div className="my-3">
                  <h6>{t(field.title)}</h6>
                  <p>{typeof field.status === 'string' && t(field.status)}</p>
                  <p>{field.date}</p>
                  {fileFields[indexOfFileField + 1]?.status &&
                    fileFields[indexOfFileField + 1]?.date && <hr></hr>}
                </div>
              ) : (
                <FileInput
                  key={field.id}
                  id={field.id}
                  disabled={field.disabled || formDisabled}
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
                    disabled={field.disabled || formDisabled}
                    defaultValue={field.default}
                    values={
                      field.values_endpoint
                        ? async () => {
                            const url = new URL(field.values_endpoint || '');
                            const res = await getApi<RailsApiResponse<any>>(
                              url?.pathname,
                            ).catch(err => err);
                            if (
                              res.Success &&
                              res.Data &&
                              Array.isArray(res.Data)
                            ) {
                              return res.Data.map(province => ({
                                text: province.name,
                                value: province.id.toString(),
                              }));
                            }
                            return [];
                          }
                        : field.values?.map(option => ({
                            value: option.id,
                            text: t(option.title),
                          })) || []
                    }
                    title={t(field.title)}
                  />
                )
              );
            }
            case 'checkbox': {
              const waiverTitle = field.id === 'compliance_waiver_1';
              const acknowledgemntTitle =
                field.id === 'compliance_knowledgment_1';
              const selfExclusionAttachment =
                field.id === 'compliance_knowledgment_3';
              return (
                <>
                  {waiverTitle && (
                    <span className="text-center">
                      {jsxT('compliance_waiver_title')}
                    </span>
                  )}
                  {acknowledgemntTitle && (
                    <span className="text-center">
                      {jsxT('compliance_knowledgment_title')}
                    </span>
                  )}
                  <CheckboxInput
                    id={field.id}
                    key={field.id}
                    title={jsxT(field.title)}
                    defaultValue={false}
                    rules={{
                      required: `${t('self-exclusion_checkbox_required')}`,
                    }}
                    className="mb-4"
                  />
                  {selfExclusionAttachment && (
                    <Link
                      to={t('compliance_link')}
                      className="compliance-doc-link"
                      target="_blank"
                    >
                      <i className={clsx(icon?.download, 'icon')}></i>
                      {t('self_exclusion_download')}
                    </Link>
                  )}
                </>
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
                    decimalScale: 0,
                  };
                } else if (
                  field.formatting === 'currency' ||
                  field.id.includes('amount')
                ) {
                  masketInput = {
                    prefix: `${user.currency} `,
                    thousandSeparator: true,
                    allowNegative: false,
                    decimalScale: 2,
                    fixedDecimalScale: true,
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
                  let format = '###-##-####';
                  if (field.default && field.default?.toString().length !== 9)
                    field.default = field.default?.toString().padStart(9, '*');
                  if (
                    field.default?.includes('*') &&
                    !watch('social_security_number')
                  ) {
                    format = `###-##-${field.default.substring(5)}`;
                  }
                  masketInput = {
                    format: format,
                    mask: '_',
                    allowEmptyFormatting: true,
                  };
                }
              }
              if (field.id === 'phone_number') {
                masketInput = {
                  format: '(###) ###-####',
                  mask: '(###) ###-####'.replace(/[^1-9]/g, '').split(''),
                  useFormatted: false,
                };
              }
              const isDepositLossBetLimits = [
                'deposit_limit',
                'loss_limit',
                'bet_limit',
                'session_limit',
              ].includes(id);
              const isSSN = field.id === 'social_security_number';
              return (
                <>
                  <div className="row">
                    <div className="col-sm">
                      <TextInput
                        id={field.id}
                        key={field.id}
                        rules={
                          !field.disabled &&
                          !formDisabled && {
                            required:
                              !isDepositLossBetLimits &&
                              !isSSN &&
                              `${t(field.title)} ${t(
                                'settings_field_required',
                              )}`,
                            validate: value => {
                              if (value) {
                                if (isNewPassword)
                                  return (
                                    VALIDATIONS.password(value) ||
                                    t('register_password_weak')
                                  );
                                if (field.id === 'phone_number')
                                  return (
                                    VALIDATIONS.phone(value) ||
                                    t('phone_number_invalid')
                                  );
                                if (
                                  id === 'session_limit' &&
                                  field.id.includes('amount') &&
                                  value &&
                                  !isNaN(value)
                                ) {
                                  const weekValue = watch('limit_amount_week');
                                  const monthValue = watch(
                                    'limit_amount_month',
                                  );
                                  if (field.id.includes('day')) {
                                    const numberValue = Number(value);
                                    if (
                                      weekValue &&
                                      Number(weekValue) < numberValue
                                    ) {
                                      return t('limit_day_over_week');
                                    } else if (numberValue > 24) {
                                      return t('limit_day_over_24');
                                    }
                                  } else if (field.id.includes('week')) {
                                    trigger('limit_amount_day');
                                    const numberValue = Number(value);
                                    if (
                                      monthValue &&
                                      Number(monthValue) < numberValue
                                    ) {
                                      return t('limit_week_over_month');
                                    } else if (numberValue > 168) {
                                      return t('limit_week_over_week');
                                    }
                                  } else if (field.id.includes('month')) {
                                    trigger('limit_amount_week');
                                    const numberValue = Number(value);
                                    if (numberValue > 744) {
                                      return t('limit_month_over_month');
                                    }
                                  }
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
                              }
                            },
                          }
                        }
                        defaultValue={(() => {
                          if (
                            usaOnlyBrand &&
                            field.id === 'phone_number' &&
                            ['+', '1'].includes(field.default?.charAt(0) || '')
                          ) {
                            field.default =
                              field.default?.charAt(0) === '+'
                                ? field.default.substring(2)
                                : field.default.substring(1);
                          }
                          return field.default && translatableDefaultValues
                            ? t(field.default.toString())
                            : field.id === 'social_security_number'
                            ? ''
                            : field.default;
                        })()}
                        maskedInput={masketInput}
                        disabled={field.disabled || formDisabled}
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
                    </div>
                    {isDepositLossBetLimits && (
                      <div className="col-sm">
                        <span
                          id={field.id + '-remain'}
                          key={field.id + '-remain'}
                          className="form-group__remain"
                        >
                          <p className="form-group__remain__title">
                            {t('left_limit')}
                          </p>
                          <p className="form-group__remain__value">
                            {formattedRemainingLimit(field) || '-'}
                          </p>
                        </span>
                      </div>
                    )}
                  </div>
                  {isDepositLossBetLimits && (
                    <>
                      <div className="row">
                        <div className="col-sm">
                          <pre className="d-inline text-14 pt-1 ml-3 mb-1">
                            {t('requested_limit')}:{' '}
                          </pre>
                          <p className="d-inline text-14 pt-1">
                            {formattedRequestedLimit(
                              field,
                              watch(field.id),
                              'FutureLimitAmount',
                            ) || '-'}
                          </p>
                        </div>
                        <div className="col-sm">
                          <pre className="d-inline text-14 pt-1 ml-3 mb-1">
                            {t('current_limit')}:{' '}
                          </pre>
                          <p className="d-inline text-14 pt-1">
                            {formattedRequestedLimit(
                              field,
                              watch(field.id),
                              'LimitAmount',
                            ) || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm">
                          <pre className="d-inline text-14 pt-1 ml-3 mb-0">
                            {t('valid_from')}:{' '}
                          </pre>
                          <p className="d-inline text-14 pt-1 mb-0">
                            {foramttedValidDate(
                              field,
                              'FutureLimitValidFrom',
                            ) || '-'}
                          </p>
                        </div>
                      </div>
                      <hr></hr>
                    </>
                  )}
                </>
              );
            }
          }
        })}
      </div>
    </div>
  );
};

const SettingsForm = (props: SettingProps) => {
  const {
    id,
    fields,
    action,
    setResponse,
    fixedData,
    mutateData,
    formBody,
    blocks,
  } = props;
  const { t } = useI18n();
  const { updateUser, signout } = useAuth();
  const formMethods = useForm<any, any>({
    mode: 'onBlur',
  });
  const { handleSubmit, reset } = formMethods;

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

  const fieldsFromBlocks: SettingsField[] | undefined = useMemo(
    () =>
      blocks?.items?.reduce<SettingsField[]>(
        (prev, current) => [...prev, ...current.fields],
        [],
      ),
    [blocks],
  );

  const allFields = fieldsFromBlocks || fields;
  const resetValues = allFields
    ? allFields
        .filter(field => !field.default && field.type !== 'submit')
        .map(field => field.id)
    : [];

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
        // eslint-disable-next-line
        !v ? (formLimitsKeys.includes(k) ? (acc[k] = 0) : acc) : (acc[k] = v),
        acc
      ),
      {},
    );
    if (fixedData) {
      for (const item of fixedData) {
        if (item.id && item.value) {
          body[item.id] = item.value?.toString();
        }
      }
    }
    if (fields) {
      for (const field of fields) {
        if (!body[field.id] && field.default)
          body[field.id] = field.default.toString();
      }
    }
    if (
      body.phone_number &&
      usaOnlyBrand &&
      (body.phone_number as string).length === 10
    ) {
      body.phone_number = `+1${body.phone_number}`;
    }
    const res = await postApi<RailsApiResponse<null>>(url, body, {
      formData: formBody,
    }).catch((res: RailsApiResponse<null>) => res);
    setResponse &&
      setResponse({
        success: res.Success,
        msg: res.Message || t('api_response_failed'),
      });
    if (res.Success) {
      if ('disable_player_until' === url.split('/').reverse()[0]) {
        injectTrackerScript('exclusion');
      }
      reset(null, { keepValues: true, keepIsValid: true });
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

  return (
    <FormProvider {...formMethods}>
      <div className="personal-info-container">
        <Form
          onSubmit={handleSubmit(updateSettingsSubmit)}
          className="d-contents"
        >
          {fields && <FormFields {...props} fields={fields} />}
          {blocks &&
            blocks.items.map(block => (
              <div className={clsx(blocks?.className)} key={block.fields[0].id}>
                {block.title && (
                  <h6 className={clsx(blocks?.titleClassName)}>
                    {t(block.title)}
                  </h6>
                )}
                <FormFields
                  {...props}
                  fields={block.fields}
                  fieldsFromBlocks={fieldsFromBlocks}
                />
              </div>
            ))}
        </Form>
      </div>
    </FormProvider>
  );
};

export default SettingsForm;
