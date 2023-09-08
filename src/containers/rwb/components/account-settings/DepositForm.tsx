import React, { useEffect, useMemo } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { useAuth } from '../../../../hooks/useAuth';
import TextInput from '../../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../../components/LoadingButton';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useForm, FormProvider } from 'react-hook-form';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import useApi from '../../../../hooks/useApi';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import PaymentMethods from '../../components/account-settings/PaymentMethods';
import NumberFormat from 'react-number-format';
import { postApi } from '../../../../utils/apiUtils';
import PaymentAccountList from './PaymentAccount';
import BankDepositAccount from '../../../../types/api/deposits/account';
import AvailableBanks from '../../../../types/api/user/AvailableBanks';
import CheckboxInput from '../../../../components/customFormInputs/CheckboxInput';
import { ThemeSettings } from '../../../../constants';
interface Props {
  depositRequest: (
    inputValue: number,
    bank_id: number,
    AccountId: number | null,
    Prefill: boolean,
  ) => Promise<boolean | void>;
  disabled: boolean;
  loading: boolean;
  setApiError: (msg: string | null) => void;
  className?: string;
}

const QUICK_AMOUNTS = [10, 20, 50, 100];

const DepositForm = ({
  depositRequest,
  disabled,
  loading,
  setApiError,
  className,
}: Props) => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const defaultValue = '0.00';
  const formMethods = useForm<{
    amount: string;
    bank_id?: string | number;
    AccountId?: number;
    AccountPrefillRequested?: boolean;
  }>({
    mode: 'onBlur',
    defaultValues: {
      amount: defaultValue.toString(),
      bank_id: undefined,
      AccountPrefillRequested: false,
    },
  });
  const { data: banksData, error: banksError } = useApi<
    RailsApiResponse<AvailableBanks[]>
  >('/restapi/v1/user/available_banks');
  const banksDataLoading = !banksData && !banksError;
  const { icons: icon } = ThemeSettings!;
  const { formState, watch, setValue, reset, register, trigger } = formMethods;
  const selectedBankId = watch('bank_id');
  const selectedBankAccountId = watch('AccountId');
  const selectedBank = useMemo(
    () => banksData?.Data.find(bank => bank.bank_id === selectedBankId),
    [banksData, selectedBankId],
  );
  const bankAccountReq = useMemo(() => {
    if (!selectedBank?.prefill) return null;
    return ['/restapi/v1/deposits/accounts', { BankId: selectedBankId }];
  }, [selectedBankId]);
  const {
    data: bankAccountData,
    error: bankAccountError,
    mutate: bankAccountMutate,
  } = useApi<RailsApiResponse<BankDepositAccount[]>>(
    bankAccountReq,
    (url, body) =>
      postApi<RailsApiResponse<BankDepositAccount[]>>(url, body).then(res => {
        const isDataArray = Array.isArray(res.Data);
        return { ...res, Data: isDataArray ? res.Data : [] };
      }),
    {
      onSuccess: res => {
        if (res.Data.length) setValue('AccountId', res.Data[0].id);
      },
    },
  );
  const bankAccountDataLoading = !bankAccountData && !bankAccountError;

  const validateAmount = (value: string) => {
    if (!value) return true;
    let inputAmount = Number(value);
    const minNumber = Number(selectedBank?.min_deposit);
    const maxNumber = Number(selectedBank?.max_deposit);
    if (
      selectedBank?.min_deposit != null &&
      !isNaN(minNumber) &&
      inputAmount < minNumber
    ) {
      return t(`deposit_amount_below_minimum`);
    } else if (
      selectedBank?.max_deposit != null &&
      !isNaN(maxNumber) &&
      inputAmount > maxNumber
    ) {
      return t(`deposit_amount_above_maximum`);
    }
    return true;
  };

  const resetAmount = () =>
    reset(
      {
        amount: defaultValue.toString(),
      },
      {
        keepErrors: false,
        keepDefaultValues: true,
        keepDirty: false,
        keepIsSubmitted: false,
        keepIsValid: false,
        keepSubmitCount: false,
        keepTouched: false,
        keepValues: false,
      },
    );
  const deleteSelectedBankAccount = async () => {
    if (!selectedBankAccountId) return;
    setApiError(null);
    const result = await postApi<RailsApiResponse<null>>(
      '/restapi/v1/deposits/prefill',
      {
        AccountId: Number(selectedBankAccountId),
        Prefill: false,
      },
    ).catch((res: RailsApiResponse<null>) => res);
    if (result.Success) {
      const newBankAccountData = bankAccountData
        ? {
            ...bankAccountData,
            Data: bankAccountData.Data.filter(
              acc => acc.id !== selectedBankAccountId,
            ),
          }
        : undefined;
      bankAccountMutate(newBankAccountData);
      setValue('AccountId', newBankAccountData?.Data[0]?.id);
    } else {
      setApiError(result.Message || t('api_response_failed'));
    }
    return result.Success;
  };

  const handleSubmit = () => {
    formMethods.handleSubmit(
      async ({ amount, bank_id, AccountId, AccountPrefillRequested }) =>
        depositRequest(
          Number(amount),
          Number(bank_id),
          Number(AccountId),
          !!AccountPrefillRequested,
        ),
    )();
  };
  useEffect(() => {
    if (Number(watch('amount')) > 0) trigger('amount');
    setValue('AccountId', undefined);
  }, [selectedBankId]);
  useEffect(() => {
    if (!banksDataLoading && (!banksData?.Data || banksError)) {
      setApiError(t('api_deposit_request_error'));
    }
  }, [banksData, banksError]);
  const showBankAccountSelector =
    (!!selectedBank?.prefill && bankAccountDataLoading) ||
    !!bankAccountData?.Data.length;
  const showBankAccountPrefillCheckbox =
    selectedBank?.prefill && !selectedBankAccountId && !bankAccountDataLoading;
  const disableDepositButton =
    !formState.isDirty ||
    !watch('amount', '') ||
    validateAmount(watch('amount', '')) !== true ||
    (!!bankAccountDataLoading && !!selectedBank?.prefill);
  return (
    <div className={clsx('input-container mb-4', className)}>
      <p data-testid="title" className="input-container__title text-14 mb-2">
        {t('select_amount')}
      </p>
      <div className="d-flex justify-content-center w-100">
        <LoadingSpinner
          show={banksDataLoading || banksDataLoading}
          className="my-2"
        />
      </div>
      {banksData && (
        <FormProvider {...formMethods}>
          <div className="d-flex flex-column w-100">
            <div className={clsx('w-100 mt-2')}>
              <LoadingSpinner
                show={banksDataLoading}
                className="d-block mx-auto mb-2 w-100"
              />
              <PaymentMethods
                data={banksData?.Data.map(acc => {
                  return {
                    id: acc.bank_id,
                    value: acc.bank_id,
                    icon: acc?.icon,
                    title: acc.name,
                    onChange: () => setValue('bank_id', acc.bank_id),
                  };
                })}
                selected={selectedBankId}
                registerName={'bank_id'}
                registerOptions={{ required: t('bank_id_required') }}
                register={register}
              />
              <small
                data-testid="error"
                className="d-block form-group__error-msg"
              >
                {formState && formState?.errors['bank_id']?.message}
              </small>
              {showBankAccountSelector && (
                <>
                  <p
                    data-testid="title"
                    className="input-container__title text-14 mt-3 mb-2"
                  >
                    {t('available_bank_accounts')}
                  </p>
                  <LoadingSpinner
                    show={!!selectedBankId && bankAccountDataLoading}
                    className="d-block mx-auto mb-2"
                  />
                  <PaymentAccountList
                    accounts={
                      (bankAccountData?.Success && bankAccountData.Data) || []
                    }
                    registerName="AccountId"
                    deleteSelectedAccount={deleteSelectedBankAccount}
                    selectedBankAccount={selectedBankAccountId}
                  />
                </>
              )}
              {showBankAccountPrefillCheckbox && (
                <CheckboxInput
                  id="AccountPrefillRequested"
                  className="py-2"
                  title={jsxT('payment_prefill_checkbox')}
                  defaultValue={false}
                />
              )}
            </div>
            <Form.Group className="d-flex flex-column w-100">
              <div className={clsx('quick-amounts')}>
                {QUICK_AMOUNTS.map(value => (
                  <button
                    key={value}
                    className={clsx(
                      'quick-amounts__btn',
                      Number(watch('amount')) === Number(value) && 'active',
                    )}
                    onClick={() =>
                      setValue('amount', value.toString(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    disabled={disabled}
                  >
                    <NumberFormat
                      value={value}
                      thousandSeparator
                      displayType={'text'}
                      prefix={user.currency}
                      decimalScale={2}
                      fixedDecimalScale={true}
                    />
                  </button>
                ))}
              </div>
              <TextInput
                id="amount"
                className="input-container__input"
                title={t('deposit_input_amount')}
                maskedInput={{
                  prefix: `${user.currency} `,
                  thousandSeparator: true,
                  allowNegative: false,
                  decimalScale: 2,
                  fixedDecimalScale: true,
                }}
                rules={{
                  validate: validateAmount,
                }}
                onBlur={() => {
                  const amount = watch('amount', '');
                  if (!amount.length) {
                    resetAmount();
                  }
                }}
                disabled={disabled}
                onEnterPress={() => handleSubmit()}
                clearDefaultValueOnFocus
                defaultValue={defaultValue.toString()}
                customInputStyle={false}
              />
              <small className="my-2">
                {selectedBank?.min_deposit != null && (
                  <NumberFormat
                    value={selectedBank.min_deposit}
                    thousandSeparator
                    displayType={'text'}
                    prefix={`${t('min_deposit')}: ${user.currency}`}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                )}
                {selectedBank?.min_deposit != null &&
                  selectedBank.max_deposit != null &&
                  ' - '}
                {selectedBank?.max_deposit != null && (
                  <NumberFormat
                    value={selectedBank.max_deposit}
                    thousandSeparator
                    displayType={'text'}
                    prefix={`${t('max_deposit')}: ${user.currency}`}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                )}
              </small>
            </Form.Group>
          </div>
          <LoadingButton
            variant="primary"
            disabled={disableDepositButton}
            className={clsx('mx-auto my-2')}
            onClick={handleSubmit}
            data-testid="button"
            loading={!!formState.isSubmitting || loading}
          >
            <>
              <i className={clsx(icon?.lock, 'text-brand mr-1')}></i>
              {t('deposit_btn')}
            </>
          </LoadingButton>
        </FormProvider>
      )}
    </div>
  );
};

export default DepositForm;
