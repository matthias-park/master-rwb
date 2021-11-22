import React, { useEffect, useState } from 'react';
import Main from '../pageLayout/Main';
import Button from 'react-bootstrap/Button';
import StepsAccordion from '../components/account-settings/StepsAccordion';
import { useI18n } from '../../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';
import {
  Withdrawal,
  WithdrawalConfirmation,
  BankAccount,
} from '../../../types/api/user/Withdrawal';
import { useCallback } from 'react';
import { postApi } from '../../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import CustomAlert from '../components/CustomAlert';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import LoadingButton from '../../../components/LoadingButton';
import { useAuth } from '../../../hooks/useAuth';
import useGTM from '../../../hooks/useGTM';
import PaymentMethods from '../components/account-settings/PaymentMethods';
import { useDispatch } from 'react-redux';
import { addSymbols } from '../../../state/reducers/translations';
import { useForm, FormProvider } from 'react-hook-form';
import TextInput from '../../../components/customFormInputs/TextInput';
import Link from '../../../components/Link';

const AmountContainer = ({
  selectedBankAccount,
  requestWithdrawal,
  withdrawalConfirmData,
  withdrawalLoading,
  step,
}) => {
  const { t } = useI18n();
  const formMethods = useForm<{
    amount: string;
  }>({
    mode: 'onBlur',
    defaultValues: {
      amount: '0',
    },
  });
  const { formState, watch, reset } = formMethods;
  const { user } = useAuth();

  useEffect(() => {
    step === 1 && resetAmount();
  }, [step]);

  const resetAmount = () => {
    reset(
      {
        amount: '0',
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
  };

  const min = selectedBankAccount?.min_withdraw_amount;
  const max =
    selectedBankAccount?.max_withdraw_amount &&
    (selectedBankAccount.max_withdraw_amount < Number(user.balance) ||
      isNaN(Number(user.balance)))
      ? selectedBankAccount.max_withdraw_amount
      : user.balance;

  const validateAmount = (value: string) => {
    if (!value) return true;
    let inputAmount = Number(value);
    const minNumber = Number(min);
    const maxNumber = Number(max);
    if (min != null && !isNaN(minNumber) && inputAmount < minNumber) {
      return t(`withdrawal_amount_below_minimum`);
    } else if (max != null && !isNaN(maxNumber) && inputAmount > maxNumber) {
      return t(`withdrawal_amount_above_maximum`);
    }
    return true;
  };

  return (
    <div className="cashier-page__inputs cashier-page__block">
      <FormProvider {...formMethods}>
        <TextInput
          id="amount"
          title={t('withdrawal_amount')}
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
          disabled={!selectedBankAccount}
          onEnterPress={() =>
            formMethods.handleSubmit(async ({ amount }) =>
              requestWithdrawal(Number(amount)),
            )()
          }
          clearDefaultValueOnFocus
          defaultValue={'0'}
        />
        <small className="cashier-page__inputs-info">
          {t('min')}: {min} {user.currency} / {t('max')}: {max} {user.currency}
        </small>
        <LoadingButton
          variant="primary"
          disabled={
            !selectedBankAccount ||
            !formState.isDirty ||
            !watch('amount', '') ||
            validateAmount(watch('amount', '')) !== true
          }
          className={'rounded-pill mt-1'}
          onClick={() =>
            formMethods.handleSubmit(async ({ amount }) =>
              requestWithdrawal(Number(amount)),
            )()
          }
          data-testid="button"
          loading={
            !!formState.isSubmitting ||
            (!withdrawalConfirmData && withdrawalLoading)
          }
        >
          {t('withdrawal_btn')}
        </LoadingButton>
      </FormProvider>
    </div>
  );
};

const ConfirmContainer = ({
  withdrawalConfirmData,
  confirmWithdrawal,
  withdrawalLoading,
  resetWithdrawals,
}) => {
  const { t } = useI18n();

  return (
    <div className="cashier-page__payment-info">
      {withdrawalConfirmData ? (
        <>
          <div className="mb-4">
            {Object.keys(withdrawalConfirmData.confirm_info).map(key => (
              <div className="cashier-page__payment-info-item mb-1" key={key}>
                {t(`withdrawal_page_${key}`) + ': '}
                {key === 'account'
                  ? withdrawalConfirmData.confirm_info[key]
                      ?.match(/.{1,4}/g)
                      ?.join(' ')
                  : withdrawalConfirmData.confirm_info[key]}
              </div>
            ))}
          </div>
          <LoadingButton
            onClick={() => {
              confirmWithdrawal(withdrawalConfirmData.params);
            }}
            variant="primary"
            className="rounded-pill mr-sm-2"
            loading={withdrawalLoading}
          >
            {t('withdrawal_page_confirm')}
          </LoadingButton>
          <Button
            onClick={resetWithdrawals}
            variant="secondary"
            className="rounded-pill mt-2 mt-sm-0"
          >
            {t('withdrawal_page_cancel')}
          </Button>
        </>
      ) : (
        <div className="my-3">
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
};

const DetailsContainer = ({ withdrawalDetails, resetWithdrawals }) => {
  const { t } = useI18n();
  const { user } = useAuth();

  return (
    <>
      {withdrawalDetails && (
        <div className="cashier-page__payment-info">
          <div className="cashier-page__payment-info-item">
            <p>{t('withdrawal_amount')}</p>
            <p>
              {withdrawalDetails.amount} {user.currency}
            </p>
          </div>
          <div className="cashier-page__payment-info-item">
            <p>{t('withdrawal_method')}</p>
            <p>{withdrawalDetails.account}</p>
          </div>
          <div className="cashier-page__payment-info-item total">
            <p>{t('withdrawal_total')}</p>
            <p>
              {withdrawalDetails.total} {user.currency}
            </p>
          </div>
          <Button
            to="/welcome"
            as={Link}
            variant="primary"
            className="rounded-pill mt-2"
          >
            {t('home')}
          </Button>
          <Button
            variant="secondary"
            className="rounded-pill mt-2 ml-1"
            onClick={resetWithdrawals}
          >
            {t('withdraw_again')}
          </Button>
        </div>
      )}
    </>
  );
};

const WithdrawalPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { addToast } = useToasts();
  const [currentStep, setCurrentStep] = useState(1);
  const [withdrawalDetails, setWithdrawalDetails] = useState<{
    amount: number;
    total: number;
    account: string | undefined | null;
  } | null>(null);
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [
    withdrawalConfirmData,
    setWithdrawalConfirmData,
  ] = useState<WithdrawalConfirmation | null>(null);
  const sendDataToGTM = useGTM();
  const dispatch = useDispatch();
  const { data, error, mutate } = useApi<RailsApiResponse<Withdrawal>>(
    '/restapi/v1/withdrawals',
  );
  const [
    selectedBankAccount,
    setSelectedBankAccount,
  ] = useState<BankAccount | null>(null);
  const isDataLoading = !data && !error;
  useEffect(() => {
    if (data?.Data.translations) {
      dispatch(
        addSymbols(
          Object.keys(data.Data.translations).reduce((obj, key) => {
            obj[`withdrawal_page_${key}`] = data.Data.translations![key];
            return obj;
          }, {}),
        ),
      );
    }
  }, [data]);

  const requestWithdrawal = useCallback(
    async (amount: number) => {
      if (!selectedBankAccount) {
        return addToast('account not found for withdrawal', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      setWithdrawalLoading(true);
      const response = await postApi<RailsApiResponse<WithdrawalConfirmation>>(
        '/restapi/v1/withdrawals',
        {
          amount: amount.toString(),
          id: selectedBankAccount.uniq_id,
        },
      ).catch(() => {
        addToast('failed to withdraw amount', {
          appearance: 'error',
          autoDismiss: true,
        });
        return null;
      });
      setWithdrawalLoading(false);
      setCurrentStep(prev => prev + 1);
      setWithdrawalConfirmData(response?.Data || null);
    },
    [selectedBankAccount, user],
  );

  const confirmWithdrawal = useCallback(
    async (data: any) => {
      setWithdrawalLoading(true);
      const userBalance = user.balance;
      const response = await postApi<RailsApiResponse<null>>(
        '/restapi/v1/withdrawals/confirm',
        data,
        {
          formData: true,
        },
      ).catch((res: RailsApiResponse<null>) => {
        if (res.Fallback) {
          addToast('failed to withdraw amount', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
        return res;
      });
      sendDataToGTM({
        event: 'withdrawalRequested',
        'tglab.withdrawal.amount': data.amount,
      });
      if (response?.Success) {
        userBalance &&
          setWithdrawalDetails({
            amount: data.amount,
            total: userBalance - data.amount,
            account: selectedBankAccount?.account,
          });
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(1);
      }
      setSelectedBankAccount(null);
      setWithdrawalLoading(false);
      setWithdrawalConfirmData(null);
      mutate();
      return setSubmitResponse({
        success: response.Success,
        msg: response.Message,
      });
    },
    [selectedBankAccount, user],
  );

  const resetWithdrawals = () => {
    setWithdrawalConfirmData(null);
    setSelectedBankAccount(null);
    setWithdrawalLoading(false);
    setCurrentStep(1);
  };

  let alertMessage: { variant: string; msg: string } | undefined;
  if (!data?.Data.accounts?.length && data?.Message)
    alertMessage = { variant: 'danger', msg: data.Message };
  else if (submitResponse?.msg)
    alertMessage = {
      variant: submitResponse.success ? 'success' : 'danger',
      msg: submitResponse.msg,
    };

  return (
    <Main title="Cashier" icon="icon-deposit">
      <div className="cashier-page">
        {isDataLoading && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        )}
        {error && (
          <h2 className="mt-3 mb-5 text-center">
            {t('withdrawal_failed_load')}
          </h2>
        )}
        {data && (
          <div className="fade-in">
            <div className="cashier-page__header">
              <h4 className="cashier-page__header-title">Withdrawal</h4>
              {alertMessage && (
                <CustomAlert show variant={alertMessage.variant}>
                  {alertMessage.msg}
                </CustomAlert>
              )}
            </div>
            <div className="cashier-page__content">
              {!!data.Data.accounts?.length && (
                <StepsAccordion
                  activeStep={currentStep}
                  steps={[
                    {
                      title: 'Select Withdrawal Method',
                      content: (
                        <div className="accordion-steps__menu-content">
                          <PaymentMethods
                            data={data.Data.accounts.map(acc => {
                              return {
                                id: acc.uniq_id,
                                value: acc.uniq_id,
                                icon: acc?.icon,
                                title: acc.account,
                                onChange: () => setSelectedBankAccount(acc),
                              };
                            })}
                            selected={selectedBankAccount?.uniq_id}
                          />
                          <Button
                            variant="primary"
                            className="rounded-pill mx-auto mt-2"
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            disabled={!selectedBankAccount}
                          >
                            Continue
                          </Button>
                        </div>
                      ),
                    },
                    {
                      title: 'Withdrawal Amount',
                      content: (
                        <div className="accordion-steps__menu-content">
                          <AmountContainer
                            selectedBankAccount={selectedBankAccount}
                            requestWithdrawal={requestWithdrawal}
                            withdrawalLoading={withdrawalLoading}
                            withdrawalConfirmData={withdrawalConfirmData}
                            step={currentStep}
                          />
                        </div>
                      ),
                    },
                    {
                      title: 'Confirm details',
                      content: (
                        <div className="accordion-steps__menu-content">
                          <ConfirmContainer
                            withdrawalConfirmData={withdrawalConfirmData}
                            confirmWithdrawal={confirmWithdrawal}
                            withdrawalLoading={withdrawalLoading}
                            resetWithdrawals={resetWithdrawals}
                          />
                        </div>
                      ),
                    },
                    {
                      title: 'Acknowledgement',
                      content: (
                        <div className="accordion-steps__menu-content">
                          <DetailsContainer
                            withdrawalDetails={withdrawalDetails}
                            resetWithdrawals={resetWithdrawals}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default WithdrawalPage;
