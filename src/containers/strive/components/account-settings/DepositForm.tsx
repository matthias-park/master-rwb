import React, { useEffect, useMemo } from 'react';
import { useI18n } from '../../../../hooks/useI18n';
import { useAuth } from '../../../../hooks/useAuth';
import TextInput from '../../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../../components/LoadingButton';
import { DepositLimits } from '../../../../types/api/user/Deposit';
import RailsApiResponse from '../../../../types/api/RailsApiResponse';
import { useForm, FormProvider } from 'react-hook-form';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import useApi from '../../../../hooks/useApi';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import PaymentMethods from '../../components/account-settings/PaymentMethods';
import { Franchise } from '../../../../constants';

interface Props {
  depositRequest: (
    inputValue: number,
    bank_id: number,
  ) => Promise<boolean | void>;
  disabled: boolean;
  loading: boolean;
  setApiError: (msg: string) => void;
  depositData: RailsApiResponse<DepositLimits[] | null> | undefined;
  depositError: boolean;
}

const DepositForm = ({
  depositRequest,
  disabled,
  loading,
  setApiError,
  depositData,
  depositError,
}: Props) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const defaultValue = 0;
  const formMethods = useForm<{
    amount: string;
    bank_id: string | number | undefined;
  }>({
    mode: 'onBlur',
    defaultValues: {
      amount: defaultValue.toString(),
      bank_id: undefined,
    },
  });
  const { data: banksData, error: banksError } = useApi<any>(
    '/restapi/v1/user/available_banks',
  );
  const depositDataLoading = !depositData && !depositError;
  const banksDataLoading = !banksData && !banksError;
  const { formState, watch, setValue, reset, register } = formMethods;

  const minDeposit = t('bancontact_min_deposit', true);
  const maxDeposit = useMemo(() => {
    if (depositData?.Data?.length) {
      const getDepositLimit = (type: string) =>
        depositData.Data!.find(limit => limit.MaxDepositLimitType === type)
          ?.MaxDepositAmountLeft;
      const dayLimit = getDepositLimit('Day');
      const weekLimit = getDepositLimit('Week');
      const monthLimit = getDepositLimit('Month');
      const depositLimit = dayLimit ?? weekLimit ?? monthLimit;
      if (depositLimit != null) {
        return depositLimit;
      }
    }
    return null;
  }, [depositData?.Data, t]);

  const validateAmount = (value: string) => {
    if (!value) return true;
    let inputAmount = Number(value);
    const minNumber = Number(minDeposit);
    const maxNumber = Number(maxDeposit);
    if (minDeposit != null && !isNaN(minNumber) && inputAmount < minNumber) {
      return t(`deposit_amount_below_minimum`);
    } else if (
      maxDeposit != null &&
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

  const handleSubmit = () => {
    formMethods.handleSubmit(async ({ amount, bank_id }) =>
      depositRequest(Number(amount), Number(bank_id)),
    )();
  };

  useEffect(() => {
    if (
      (!depositDataLoading && (!depositData?.Success || depositError)) ||
      (!banksDataLoading && (!banksData?.Data || banksError))
    ) {
      setApiError(t('api_deposit_request_error'));
    }
  }, [depositData, depositError, banksData, banksError]);

  return (
    <div className="input-container mb-4">
      {Franchise.strive && (
        <div className="input-container__header d-flex align-items-center">
          <h2 className="ml-3 mb-0">{t('deposit_input_container_title')}</h2>
        </div>
      )}
      <p data-testid="title" className="input-container__title text-14 mb-2">
        {t('select_amount')}
      </p>
      <div className="d-flex justify-content-center w-100">
        <LoadingSpinner
          show={banksDataLoading || banksDataLoading}
          className="my-2"
        />
      </div>
      {banksData && depositData && (
        <FormProvider {...formMethods}>
          <div className="d-flex flex-column w-100">
            <div
              className={clsx(
                Franchise.desertDiamond && 'order-2',
                'w-100 mt-2',
              )}
            >
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
                selected={watch('bank_id')}
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
            </div>
            <Form.Group className="d-flex flex-column w-100">
              <div
                className={clsx(
                  Franchise.desertDiamond && 'order-2',
                  'quick-amounts',
                )}
              >
                {[10, 20, 50, 100].map(value => (
                  <button
                    key={value}
                    className={clsx(
                      'quick-amounts__btn',
                      watch('amount') === value.toString() && 'active',
                    )}
                    onClick={() =>
                      setValue('amount', value.toString(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    disabled={disabled}
                  >
                    {`${user.currency} ${value}`}
                  </button>
                ))}
              </div>
              <TextInput
                id="amount"
                className="input-container__input"
                title={t('deposit_input_amount')}
                maskedInput={{
                  allowEmptyFormatting: true,
                  prefix: `${user.currency} `,
                  thousandSeparator: true,
                  allowNegative: false,
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
                customInputStyle={Franchise.desertDiamond}
              />
              <small className="my-2">
                {clsx(
                  minDeposit != null &&
                    `${t('min_deposit')}: ${minDeposit} ${user.currency}`,
                  minDeposit != null && maxDeposit != null && '-',
                  maxDeposit != null &&
                    `${t('max_deposit')}: ${maxDeposit} ${user.currency}`,
                )}
              </small>
            </Form.Group>
          </div>
          <LoadingButton
            variant="primary"
            disabled={
              !formState.isDirty ||
              !watch('amount', '') ||
              validateAmount(watch('amount', '')) !== true
            }
            className={clsx(Franchise.desertDiamond ? 'mt-3' : 'mx-auto my-2')}
            onClick={handleSubmit}
            data-testid="button"
            loading={!!formState.isSubmitting || loading}
          >
            <>
              <i className="icon-lock1 text-brand mr-1"></i>
              {t('deposit_btn')}
            </>
          </LoadingButton>
        </FormProvider>
      )}
    </div>
  );
};

export default DepositForm;
