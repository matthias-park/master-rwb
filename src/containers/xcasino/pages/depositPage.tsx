import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { useAuth } from '../../../hooks/useAuth';
import TextInput from '../../../components/customFormInputs/TextInput';
import LoadingButton from '../../../components/LoadingButton';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import useApi from '../../../hooks/useApi';
import PaymentMethods from '../components/account-settings/PaymentMethods';
import Button from 'react-bootstrap/Button';
import StepsAccordion from '../components/account-settings/StepsAccordion';
import Main from '../pageLayout/Main';
import { KYC_VALIDATOR_STATUS } from '../../../types/UserStatus';
import useDepositResponseStatus from '../../../hooks/useDepositResponseStatus';
import useGTM from '../../../hooks/useGTM';
import { useRoutePath } from '../../../hooks';
import { CustomWindowEvents, PagesName } from '../../../constants';
import {
  DepositRequest,
  DepositResponse,
  DepositStatus,
} from '../../../types/api/user/Deposit';
import { postApi } from '../../../utils/apiUtils';
import CustomAlert from '../components/CustomAlert';
import Spinner from 'react-bootstrap/Spinner';
import Link from '../../../components/Link';
import useLocalStorage from '../../../hooks/useLocalStorage';
import * as Sentry from '@sentry/react';
import { useConfig } from '../../../hooks/useConfig';
import RequestReturn from '../../../types/api/deposits/RequestReturn';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
import NumberFormat from 'react-number-format';

const AmountContainer = ({
  handleRequestDeposit,
  depositStatus,
  depositLoading,
  step,
  selectedBank,
}) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { formState, watch, reset, handleSubmit } = useFormContext();

  const disabled =
    user.validator_status ===
      KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataOnly ||
    depositStatus.depositStatus === DepositStatus.Pending;

  const loading = !!formState.isSubmitting || depositLoading;

  const minDeposit = selectedBank?.min_deposit;
  const maxDeposit = selectedBank?.max_deposit;

  useEffect(() => {
    step === 1 && resetAmount();
  }, [step]);

  const handleOnSubmit = () => {
    handleSubmit(async ({ amount, bank_id }) =>
      handleRequestDeposit(Number(amount), Number(bank_id)),
    )();
  };

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

  return (
    <div className="cashier-page__inputs cashier-page__block">
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
        onEnterPress={() => handleOnSubmit()}
        clearDefaultValueOnFocus
        defaultValue={'0'}
      />
      <small className="cashier-page__inputs-info">
        {minDeposit != null && (
          <NumberFormat
            value={selectedBank.min_deposit}
            displayType="text"
            prefix={`${t('min_deposit')}: `}
            suffix={` ${user.currency}`}
          />
        )}
        {minDeposit != null && maxDeposit != null && ' - '}
        {maxDeposit != null && (
          <NumberFormat
            value={maxDeposit}
            thousandSeparator
            displayType={'text'}
            prefix={`${t('max_deposit')}: `}
            suffix={` ${user.currency}`}
          />
        )}
      </small>
      <LoadingButton
        variant="primary"
        disabled={
          !formState.isDirty ||
          !watch('amount', '') ||
          validateAmount(watch('amount', '')) !== true
        }
        className="rounded-pill mt-1"
        onClick={handleOnSubmit}
        data-testid="button"
        loading={!!formState.isSubmitting || loading}
      >
        <>{t('deposit_btn')}</>
      </LoadingButton>
    </div>
  );
};

const DetailsContainer = ({ depositStatus, depositDetails, resetDeposits }) => {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <>
      {depositStatus.depositStatus === DepositStatus.Confirmed &&
      depositDetails ? (
        <div className="cashier-page__payment-info">
          <div className="cashier-page__payment-info-item">
            <p>{t('deposit_amount')}</p>
            <p>
              {depositDetails.amount} {user.currency}
            </p>
          </div>
          <div className="cashier-page__payment-info-item total">
            <p>{t('deposit_total')}</p>
            <p>
              {depositDetails.total} {user.currency}
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
            onClick={resetDeposits}
          >
            {t('deposit_again')}
          </Button>
        </div>
      ) : (
        <div className="my-3 ml-3">
          <Spinner animation="border" />
        </div>
      )}
    </>
  );
};

const DepositPage = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const formMethods = useForm<{
    amount: string;
    bank_id: string | number | undefined;
  }>({
    mode: 'onBlur',
    defaultValues: {
      amount: '0',
      bank_id: undefined,
    },
  });
  const { watch, setValue, register } = formMethods;
  const watchBankId = watch('bank_id');
  const [apiError, setApiError] = useState<string | null>(null);
  const [customHtml, setCustomHtml] = useState<string | null>(null);
  const depositBaseUrl = useRoutePath(PagesName.DepositPage, true);
  const depositStatus = useDepositResponseStatus();
  const sendDataToGTM = useGTM();
  const [currentStep, setCurrentStep] = useState(1);
  const [depositLoading, setDepositLoading] = useState(false);
  const { data: banksData, error: banksError } = useApi<any>(
    '/restapi/v1/user/available_banks',
  );
  const banksDataLoading = !banksData && !banksError;
  const [depositDetails, setDepositDetails] = useLocalStorage<{
    amount: number;
    total: number;
  } | null>('deposit_details', null);
  const selectedBankId = watch('bank_id');
  const selectedBank = useMemo(
    () => banksData?.Data.find(bank => bank.bank_id === selectedBankId),
    [banksData, selectedBankId],
  );
  useEffect(() => {
    if (
      [DepositStatus.Confirmed, DepositStatus.Rejected].includes(
        depositStatus.depositStatus,
      )
    ) {
      sendDataToGTM({
        event: 'depositStatusChange',
        'tglab.deposit.success':
          depositStatus.depositStatus === DepositStatus.Confirmed,
      });
    }

    if (depositStatus.depositStatus === DepositStatus.Confirmed) {
      setCurrentStep(4);
    }
  }, [depositStatus.depositStatus]);

  const handleRequestDeposit = useCallback(
    async (depositValue: number, bankId: number) => {
      setApiError(null);
      setDepositLoading(true);
      const userBalance = user.balance;
      const depositParams: DepositRequest = {
        BankId: bankId,
        Amount: depositValue,
        ReturnSuccessUrl: `${window.location.origin}${depositBaseUrl}/loading`,
        ReturnCancelUrl: `${window.location.origin}${depositBaseUrl}/cancel`,
        locale: 'en_US',
      };
      const response: RailsApiResponse<DepositResponse | null> = await postApi<
        RailsApiResponse<DepositResponse>
      >('/restapi/v1/deposits/perform', depositParams).catch(
        (res: RailsApiResponse<null>) => {
          return res;
        },
      );
      if (response.Success) {
        userBalance &&
          setDepositDetails({
            amount: depositValue,
            total: userBalance + depositValue,
          });
        if (response.Data?.DepositRequestId) {
          depositStatus.setDepositId(response.Data.DepositRequestId, bankId);
        }
        if (response.Data?.InnerText) {
          window.addEventListener(
            CustomWindowEvents.DepositPaymentSuccess,
            () => {
              setCustomHtml(null);
              depositStatus.startCheckingStatus();
            },
          );
          window.addEventListener(
            CustomWindowEvents.DepositPaymentError,
            () => {
              setCustomHtml(null);
              setDepositLoading(false);
              setApiError(t('api_response_failed'));
            },
          );
          window.addEventListener(
            CustomWindowEvents.DepositRequestReturn,
            event => {
              if (event.detail) {
                const data = {
                  ...event.detail,
                  depositRequestId: response.Data?.DepositRequestId,
                };
                if (bankId === 189) {
                  data.browserInfo = {
                    acceptHeader: '*',
                    colorDepth: window.screen.colorDepth,
                    javaEnabled: false,
                    language: locale,
                    screenHeight: window.innerHeight,
                    screenWidth: window.innerWidth,
                    timeZoneOffset: new Date().getTimezoneOffset(),
                    userAgent: window.navigator.userAgent,
                  };
                }
                postApi<RailsApiResponse<RequestReturn>>(
                  '/restapi/v1/deposits/request_return',
                  {
                    bank_id: bankId.toString(),
                    data: JSON.stringify(data),
                  },
                )
                  .then(res => {
                    if (res.Data.OK) {
                      if (res.Data.AdditionalData?.redirectUrl) {
                        return (window.location.href =
                          res.Data.AdditionalData.redirectUrl);
                      }
                      if (res.Data.AdditionalData?.verifyPaymentData) {
                        return window.dispatchEvent(
                          new CustomEvent(
                            CustomWindowEvents.DepositVerifyPayment,
                            {
                              detail:
                                res.Data.AdditionalData?.verifyPaymentData,
                            },
                          ),
                        );
                      }
                      setCustomHtml(null);
                      depositStatus.startCheckingStatus();
                    } else if (res.Data.Error) {
                      setCurrentStep(1);
                      setApiError(t('api_response_failed'));
                      Sentry.captureMessage(
                        `Got DepositRequestReturn error: ${res.Data.Error}`,
                        Sentry.Severity.Info,
                      );
                    }
                  })
                  .catch(() => null);
              } else {
                Sentry.captureMessage(
                  'Got DepositRequestReturn without data',
                  Sentry.Severity.Fatal,
                );
              }
            },
          );
          setCurrentStep(prev => prev + 1);
          let html = atob(response.Data.InnerText);
          html = html.replace(
            /<(\/?|!?)(DOCTYPE html|html|head|body|meta)([^>]*)>/gm,
            '',
          );
          const translationMatches = html.match(/\{{(.*?)\}}/gm);
          translationMatches?.forEach(match => {
            const symbol = /\{{(.*?)\}}/gm.exec(match)?.[1];
            if (symbol) {
              const translation = t(symbol);
              html = html.replace(match, translation);
            }
          });
          return setCustomHtml(html);
        } else if (
          response?.Success &&
          response.Data?.RedirectUrl &&
          response.Data?.DepositRequestId
        ) {
          return !!(window.location.href = response.Data.RedirectUrl);
        }
      }
      if (!response || !response.Success || response.Message) {
        setApiError(response?.Message || t('api_response_failed'));
      }
      setDepositLoading(false);
      return false;
    },
    [],
  );

  const resetDeposits = () => {
    setCustomHtml(null);
    setDepositLoading(false);
    setDepositDetails(null);
    setCurrentStep(1);
  };

  useEffect(() => {
    if (!banksDataLoading && (!banksData?.Data || banksError)) {
      setApiError(t('api_deposit_request_error'));
    }
  }, [banksData, banksError]);

  const alertData = useMemo(() => {
    if (
      ![DepositStatus.Pending, DepositStatus.None].includes(
        depositStatus.depositStatus,
      )
    ) {
      return {
        variant:
          depositStatus.depositStatus === DepositStatus.Confirmed
            ? 'success'
            : 'danger',
        msg: depositStatus.message,
      };
    } else if (apiError) {
      return {
        variant: 'danger',
        msg: apiError,
      };
    }
    return null;
  }, [banksData, apiError]);

  const depositFrame = useMemo(() => {
    if (!customHtml) return null;
    return replaceStringTagsReact(customHtml);
  }, [customHtml]);
  return (
    <Main title="Cashier" icon="icon-deposit">
      <div className="cashier-page">
        {depositStatus.depositStatus === DepositStatus.Pending && (
          <div className="d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        )}
        {banksData && (
          <>
            <CustomAlert show={!!alertData} variant={alertData?.variant}>
              {alertData?.msg}
            </CustomAlert>
            <FormProvider {...formMethods}>
              <div className="fade-in">
                <div className="cashier-page__header">
                  <h4 className="cashier-page__header-title">Deposit</h4>
                </div>
                <div className="cashier-page__content">
                  <StepsAccordion
                    activeStep={currentStep}
                    steps={[
                      {
                        title: 'Select Deposit Method',
                        content: (
                          <div className="accordion-steps__menu-content">
                            <PaymentMethods
                              data={banksData?.Data.map(acc => {
                                return {
                                  id: acc.bank_id,
                                  value: acc.bank_id,
                                  icon: acc?.icon,
                                  title: acc.name,
                                  minDeposit: acc.min_deposit,
                                  maxDeposit: acc.max_deposit,
                                  onChange: () =>
                                    setValue('bank_id', acc.bank_id),
                                };
                              })}
                              selected={selectedBankId}
                              registerName={'bank_id'}
                              registerOptions={{
                                required: t('bank_id_required'),
                              }}
                              register={register}
                            />
                            <Button
                              variant="primary"
                              className="rounded-pill mx-auto mt-2"
                              disabled={!watchBankId}
                              onClick={() => setCurrentStep(prev => prev + 1)}
                            >
                              Continue
                            </Button>
                          </div>
                        ),
                      },
                      {
                        title: 'Deposit Amount',
                        content: (
                          <div className="accordion-steps__menu-content">
                            <AmountContainer
                              handleRequestDeposit={handleRequestDeposit}
                              depositStatus={depositStatus}
                              depositLoading={depositLoading}
                              step={currentStep}
                              selectedBank={selectedBank}
                            />
                          </div>
                        ),
                      },
                      {
                        title: 'Deposit Details',
                        content: (
                          <div className="accordion-steps__menu-content text-dark">
                            {depositFrame}
                          </div>
                        ),
                      },
                      {
                        title: 'Acknowledgement',
                        content: (
                          <div className="accordion-steps__menu-content">
                            <DetailsContainer
                              depositStatus={depositStatus}
                              depositDetails={depositDetails}
                              resetDeposits={resetDeposits}
                            />
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </FormProvider>
          </>
        )}
      </div>
    </Main>
  );
};

export default DepositPage;
