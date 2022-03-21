import { CustomWindowEvents, ComponentName } from '../constants';
import RequestReturn from '../types/api/deposits/RequestReturn';
import RailsApiResponse from '../types/api/RailsApiResponse';
import depositEventHandlerProps from '../types/DepositEventHandler';
import { postApi } from './apiUtils';
import * as Sentry from '@sentry/react';

const depositEventHandler = ({
  eventType,
  eventData,
  setCustomHtml,
  depositStatus,
  setApiError,
  setDepositLoading,
  t,
  depositRequestId,
  bankId,
  locale,
  setCurrentStep,
  disableModal,
  depositForm,
}: depositEventHandlerProps) => {
  switch (eventType) {
    case CustomWindowEvents.DepositPaymentSuccess: {
      setApiError(null);
      setCustomHtml(null);
      depositStatus.startCheckingStatus();
      break;
    }
    case CustomWindowEvents.DepositPaymentError: {
      if (typeof eventData === 'string') {
        Sentry.captureMessage(`deposit error: ${eventData}`);
        setApiError({ message: eventData, variant: 'danger' });
      } else {
        setApiError({ message: t('api_response_failed'), variant: 'danger' });
      }
      setCustomHtml(null);
      setDepositLoading(false);
      break;
    }
    case CustomWindowEvents.DepositPaymentWarning: {
      if (typeof eventData === 'string') {
        setApiError({ message: eventData, variant: 'warning' });
      }
      break;
    }
    case CustomWindowEvents.DepositRequestReturn: {
      if (eventData && typeof eventData === 'object') {
        const data: any = {
          ...eventData,
          depositRequestId,
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
                if (depositForm) {
                  window.open(res.Data.AdditionalData.redirectUrl, '_blank');
                  disableModal?.(ComponentName.QuickDepositModal);
                } else {
                  window.location.href = res.Data.AdditionalData.redirectUrl;
                }
                return;
              }
              if (res.Data.AdditionalData?.verifyPaymentData) {
                return window.postMessage(
                  JSON.stringify({
                    eventType: CustomWindowEvents.DepositVerifyPayment,
                    eventData: res.Data.AdditionalData.verifyPaymentData,
                  }),
                  '*',
                );
              }
              setCustomHtml(null);
              depositStatus.startCheckingStatus();
            } else if (res.Data.Error) {
              setCurrentStep?.(1);
              setApiError({
                message: t('api_response_failed'),
                variant: 'danger',
              });
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
    }
  }
};
export default depositEventHandler;
