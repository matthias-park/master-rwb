import React, { useCallback, useEffect } from 'react';
import { SettingsField } from '../../../../types/api/user/ProfileSettings';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import { franchiseDateFormat, VALIDATIONS } from '../../../../constants';
import TextInput from '../../../../components/customFormInputs/TextInput';
import { useAuth } from '../../../../hooks/useAuth';
import { postApi } from '../../../../utils/apiUtils';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import dayjs from 'dayjs';
import CustomSelectInput from '../../../../components/customFormInputs/CustomSelectInput';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { useCompleteRegistration } from '../../../../hooks/useCompleteRegistration';
interface SettingProps {
  id: string;
  fields?: SettingsField[];
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
  blocks?: {
    items: {
      title?: string;
      fields: SettingsField[];
    }[];
    className?: string;
    titleClassName?: string;
  };
  actionButtonOnClick?: () => void;
  formatRequestBody?: (data: any) => any;
  successCallback?: () => void;
  focusInput?: string | boolean;
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
  formData,
  translatableDefaultValues,
  actionButtonOnClick,
  focusInput,
}: SettingProps) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const showHiddenUsernameField = fields?.some(
    field => field.id === 'password',
  );
  const {
    watch,
    formState,
    register,
    setValue,
    getValues,
    setFocus,
  } = useFormContext();
  const watchAllFields = watch(
    fields
      .filter(item => !item.disabled && item.type !== 'submit')
      .map(field => field.id),
  );

  useEffect(() => {
    if (focusInput) {
      typeof focusInput === 'string'
        ? setFocus(focusInput)
        : setFocus(fields[0].id);
    }
  }, [setFocus]);

  return (
    <div data-testid="form-container" className="d-contents">
      {showHiddenUsernameField && (
        <input
          id="username"
          name="username"
          style={{ display: 'none' }}
          type="text"
        />
      )}
      {fields.map((field, i) => {
        switch (field.type) {
          case 'button': {
            return (
              <Button
                variant="tertiary"
                className="rounded-pill mt-2 mr-1"
                onClick={actionButtonOnClick}
              >
                {t(field.title)}
              </Button>
            );
          }
          case 'submit': {
            const isDeleteButton = field.id === 'submit_button_delete';
            const submitWithCurrentAction =
              field.value && getValues(field.value?.id) === field.value?.value;
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
                  disabled={
                    field.disabled ||
                    Object.values(watchAllFields).some(
                      value => value === '' || value === 'default',
                    ) ||
                    (isDeleteButton && !Object.keys(formData).length)
                  }
                  className="mt-2 mr-1 rounded-pill"
                  variant="primary"
                  type="submit"
                  onClick={() =>
                    field.value && setValue(field.value?.id, field.value?.value)
                  }
                >
                  {t(field.title)}
                </LoadingButton>
              </>
            );
          }
          case 'select': {
            return (
              <CustomSelectInput
                key={field.id}
                id={field.id}
                rules={{
                  required: `${t(field.title)} ${t('settings_field_required')}`,
                }}
                defaultValue={
                  formsWithLogoutUser.includes(field.id)
                    ? field?.default?.id
                    : fields[0].values && fields[0].values[i].id
                }
                defaultTitle={field?.default?.title}
                values={
                  field.values?.map(option => ({
                    value: option.id,
                    text: option.title,
                  })) || []
                }
                title={t(field.title)}
                setValue={setValue}
              />
            );
          }
          default: {
            const noPrefixNeeded = [
              'deposit_limit_count',
              'session_limit',
            ].includes(id);
            const isPassword = ['password'].includes(field.type);
            const isNewPassword = [
              'new_password',
              'new_password_confirmation',
            ].includes(field.id);
            let masketInput;
            if (field.formatting !== 'none') {
              if (field.formatting === 'hour') {
                masketInput = {
                  allowEmptyFormatting: true,
                };
              } else if (
                field.formatting === 'currency' ||
                (field.id.includes('amount') && !noPrefixNeeded)
              ) {
                masketInput = {
                  prefix: `${user.currency} `,
                  thousandSeparator: true,
                  allowNegative: false,
                };
              } else if (field.formatting === 'date') {
                masketInput = {
                  format: franchiseDateFormat.replace(/[A-Za-z]/g, '#'),
                  mask: franchiseDateFormat.replace(/[^A-Za-z]/g, '').split(''),
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
              } else if (noPrefixNeeded) {
                masketInput = {
                  isNumericString: true,
                };
              }
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
                      let translation;
                      if (id === 'session_limit') {
                        const data = {
                          day: {
                            maxHours: 24,
                            translation: 'limit_day_over_24',
                          },
                          week: {
                            maxHours: 168,
                            translation: 'limit_week_over_168',
                          },
                          month: {
                            maxHours: 744,
                            translation: 'limit_month_over_744',
                          },
                        };
                        // eslint-disable-next-line
                        const valid = Object.keys(data).some(period => {
                          if (field.id.includes(period)) {
                            translation = data[period].translation;
                            return Number(value) <= data[period].maxHours;
                          }
                        });
                        return valid || t(translation);
                      }
                      if (isNewPassword)
                        return (
                          VALIDATIONS.password(value) ||
                          t('register_password_weak')
                        );
                      if (field.id === 'phone_number')
                        return (
                          VALIDATIONS.phone(value) || t('phone_number_invalid')
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
                      if (['first_name', 'last_name'].includes(field.id)) {
                        return (
                          VALIDATIONS.name(value) || t('field_only_letters')
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
                          (value.length === 9 && !isNaN(parseInt(value))) ||
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
                    : field.default?.toString()
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
    validateBeforeRequest,
    blocks,
    formatRequestBody,
    successCallback,
    focusInput,
    translatableDefaultValues,
  } = props;
  const { t } = useI18n();
  const { updateUser, signout } = useAuth();
  const formMethods = useForm<any, any>({
    mode: 'onBlur',
  });
  const { handleSubmit, reset } = formMethods;

  const {
    registrationIncomplete,
    updateCompletedActions,
  } = useCompleteRegistration();

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

  const resetValues = fields
    ? fields
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
    if (fields !== undefined) {
      for (const field of fields) {
        if (!body[field.id] && field.default)
          body[field.id] =
            field.type === 'select'
              ? field.default.value.toString()
              : field.default.toString();
      }
    }
    if (formatRequestBody) {
      body = formatRequestBody(body);
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
      reset(null, { keepValues: true });
      resetValues.forEach(id => formMethods.setValue(id, ''));
      successCallback && successCallback();
      if (registrationIncomplete) {
        updateCompletedActions(prevState => {
          return {
            ...prevState,
            sessionLimitAdded:
              url.includes('set_session_limit') || prevState.sessionLimitAdded,
            depositLimitCountAdded:
              url.includes('set_deposit_count_limit') ||
              prevState.depositLimitCountAdded,
            maxBalanceAdded:
              url.includes('set_max_balance_limit') ||
              prevState.maxBalanceAdded,
          };
        });
      }
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
      <Form
        onSubmit={handleSubmit(updateSettingsSubmit)}
        className="d-contents"
      >
        {fields && (
          <FormFields {...props} fields={fields} focusInput={focusInput} />
        )}
        {blocks &&
          blocks.items.map(block => (
            <div className={clsx(blocks?.className)} key={block.fields[0].id}>
              {block.title && (
                <h6 className={clsx(blocks?.titleClassName)}>{block.title}</h6>
              )}
              <FormFields
                {...props}
                fields={block.fields}
                focusInput={focusInput}
                translatableDefaultValues={translatableDefaultValues}
              />
            </div>
          ))}
      </Form>
    </FormProvider>
  );
};

export default SettingsForm;
