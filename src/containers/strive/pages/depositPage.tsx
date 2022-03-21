import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  ReactElement,
} from 'react';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import { postApi } from '../../../utils/apiUtils';
import {
  DepositRequest,
  DepositResponse,
  DepositStatus,
} from '../../../types/api/user/Deposit';
import { useI18n } from '../../../hooks/useI18n';
import {
  CustomWindowEvents,
  PagesName,
  Franchise,
  ComponentName,
} from '../../../constants';
import CustomAlert from '../components/CustomAlert';
import { useRoutePath } from '../../../hooks';
import { useAuth } from '../../../hooks/useAuth';
import { KYC_VALIDATOR_STATUS } from '../../../types/UserStatus';
import useDepositResponseStatus, {
  isDepositStatusSuccess,
} from '../../../hooks/useDepositResponseStatus';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';
import { useModal } from '../../../hooks/useModal';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DepositForm from '../components/account-settings/DepositForm';
import StyledIframe from '../components/styled/StyledDepositIframe';
import BalancesContainer from '../components/account-settings/BalancesContainer';
import clsx from 'clsx';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
import { injectTrackerScript } from '../../../utils/uiUtils';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useConfig } from '../../../hooks/useConfig';
import depositEventHandler from '../../../utils/depositEventHandler';
import * as Sentry from '@sentry/react';

const questionItems = [
  { title: 'deposit_question_1', body: 'deposit_answer_1' },
  { title: 'deposit_question_2', body: 'deposit_answer_2' },
];

const DepositPage = ({ depositForm }: { depositForm?: boolean }) => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const [depositLoading, setDepositLoading] = useState(false);
  const [apiError, setApiError] = useState<{
    message: string;
    variant: 'danger' | 'warning';
  } | null>(null);
  const [depositAmount, setDepositAmount] = useLocalStorage<number | null>(
    'deposit_amount',
    null,
  );
  const [customHtml, setCustomHtml] = useState<{
    html: string;
    iframe: boolean;
  } | null>(null);
  const depositBaseUrl = useRoutePath(PagesName.DepositPage, true);
  const depositStatus = useDepositResponseStatus();
  const sendDataToGTM = useGTM();
  const { disableModal } = useModal();
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
    if (
      isDepositStatusSuccess(depositStatus.depositStatus) &&
      !!depositAmount
    ) {
      injectTrackerScript(
        user.total_deposit_count === 0
          ? 'firstdepositconfirm'
          : 'depositconfirm',
        user.id,
        user.currency,
        depositAmount,
      );
      setDepositAmount(null);
    }
  }, [depositStatus.depositStatus]);

  const validatorNotOk = [
    KYC_VALIDATOR_STATUS.CanPlayAndShouldUpdatePersonalData,
    KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataOnly,
    KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataLimitedAttempts,
    KYC_VALIDATOR_STATUS.ShouldUploadDocumentForKyc,
  ].includes(user.validator_status || 0);

  const handleRequestDeposit = useCallback(
    async (
      depositValue: number,
      bankId: number,
      AccountId: number | null = null,
      AccountPrefillRequested: boolean = false,
    ) => {
      setApiError(null);
      setDepositLoading(true);
      setDepositAmount(depositValue);
      const depositParams: DepositRequest = {
        BankId: bankId,
        Amount: depositValue,
        ReturnSuccessUrl: `${window.location.origin}${depositBaseUrl}/loading`,
        ReturnCancelUrl: `${window.location.origin}${depositBaseUrl}/cancel`,
        ReturnErrorUrl: `${window.location.origin}${depositBaseUrl}/error`,
        locale: 'en_US',
        AccountId: AccountId || null,
        AccountPrefillRequested: !!AccountId || AccountPrefillRequested,
      };
      const response: RailsApiResponse<DepositResponse | null> = await postApi<
        RailsApiResponse<DepositResponse>
      >('/restapi/v1/deposits/perform', depositParams).catch(
        (res: RailsApiResponse<null>) => {
          return res;
        },
      );
      if (response.Success) {
        if (
          response.Data?.DepositRequestId ||
          response.Data?.DepositRequestId === 0
        ) {
          depositStatus.setDepositId(response.Data.DepositRequestId, bankId);
        }
        if (response.Data?.InnerText && response.Data?.DepositRequestId) {
          let html = atob(response.Data.InnerText);
          const iframeHtml = html.includes('window.onload');
          const handlePaymentEvent = (
            eventType: CustomWindowEvents,
            eventData?: string | object,
          ) =>
            depositEventHandler({
              eventType,
              eventData,
              bankId,
              depositRequestId: response.Data!.DepositRequestId,
              depositStatus,
              setApiError,
              setCustomHtml: html =>
                setCustomHtml(html ? { html, iframe: iframeHtml } : null),
              setDepositLoading,
              t,
              locale,
              disableModal,
              depositForm,
            });
          window.addEventListener(
            CustomWindowEvents.DepositPaymentSuccess,
            () => handlePaymentEvent(CustomWindowEvents.DepositPaymentSuccess),
          );
          window.addEventListener(CustomWindowEvents.DepositPaymentError, () =>
            handlePaymentEvent(CustomWindowEvents.DepositPaymentError),
          );
          window.addEventListener(
            CustomWindowEvents.DepositRequestReturn,
            event =>
              handlePaymentEvent(
                CustomWindowEvents.DepositRequestReturn,
                event.detail,
              ),
          );
          window.addEventListener('message', (e: MessageEvent<any>) => {
            try {
              const data =
                typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
              if (!data.eventType || e.origin !== window.location.origin)
                return;
              handlePaymentEvent(data.eventType, data.eventData);
            } catch {
              return;
            }
          });
          let htmlString = atob(response.Data.InnerText);
          if (!iframeHtml) {
            const htmlParser = new DOMParser();
            const html = htmlParser.parseFromString(htmlString, 'text/html');
            const headEl = html.getElementsByTagName('head')[0];
            const headScripts = [
              ...Array.from(headEl.getElementsByTagName('script')),
              ...Array.from(headEl.getElementsByTagName('link')),
              ...Array.from(headEl.getElementsByTagName('style')),
            ];
            const alreadyLoadedScriptsLinks = [
              ...Array.from(document.head.getElementsByTagName('script')),
              ...Array.from(document.head.getElementsByTagName('link')),
            ];
            const insertScriptLinkToHead = (
              newTagEl: HTMLScriptElement | HTMLLinkElement | HTMLStyleElement,
            ): Promise<boolean> =>
              new Promise(resolve => {
                if (
                  alreadyLoadedScriptsLinks.some(tag => {
                    if (tag.tagName !== newTagEl.tagName) return false;
                    const tagUrl =
                      (tag as HTMLScriptElement).src ||
                      (tag as HTMLLinkElement).href;
                    const newTagUrl =
                      (newTagEl as HTMLScriptElement).src ||
                      (newTagEl as HTMLLinkElement).href;
                    if (
                      ['SCRIPT', 'STYLE'].includes(newTagEl.tagName) &&
                      !newTagUrl
                    ) {
                      return tag.innerHTML === newTagEl.innerHTML;
                    }
                    return tagUrl && newTagUrl && tagUrl === newTagUrl;
                  })
                ) {
                  return resolve(true);
                }
                const el = document.createElement(newTagEl.tagName);
                Object.values(newTagEl.attributes).forEach(attr => {
                  const attrName =
                    attr.name === 'crossorigin' ? 'crossOrigin' : attr.name;
                  el[attrName] = attr.value;
                });
                el.innerHTML = newTagEl.innerHTML;
                el.onload = () => resolve(true);
                el.onerror = () => {
                  Sentry.captureMessage(
                    `Failed loading deposit tag ${
                      (newTagEl as HTMLScriptElement).src ||
                      (newTagEl as HTMLLinkElement).href
                    }`,
                  );
                  resolve(false);
                };
                document.head.appendChild(el);
                if (el.innerHTML) {
                  return resolve(true);
                }
              });
            const scriptLoaded = await Promise.all(
              Array.from(headScripts).map(insertScriptLinkToHead),
            ).then(loaded => loaded.every(Boolean));
            if (scriptLoaded) {
              htmlString = html.getElementsByTagName('body')[0].innerHTML;
              const translationMatches = htmlString.match(/\{{(.*?)\}}/gm);
              translationMatches?.forEach(match => {
                const symbol = /\{{(.*?)\}}/gm.exec(match)?.[1];
                if (symbol) {
                  const translation = t(symbol);
                  htmlString = htmlString.replace(match, translation);
                }
              });
            } else {
              setCustomHtml(null);
              setApiError({
                message: t('api_response_failed'),
                variant: 'danger',
              });
            }
            setDepositLoading(false);
          }
          return setCustomHtml({ html: htmlString, iframe: iframeHtml });
        } else if (
          response?.Success &&
          response.Data?.RedirectUrl &&
          (response.Data?.DepositRequestId ||
            response.Data?.DepositRequestId === 0)
        ) {
          if (depositForm) {
            window.open(response.Data.RedirectUrl, '_blank');
            disableModal(ComponentName.QuickDepositModal);
          } else {
            window.location.href = response.Data.RedirectUrl;
          }
          return;
        } else if (response.Data?.PaymentResult) {
          setApiError(null);
          depositStatus.startCheckingStatus();
        }
      }
      if (!response || !response.Success || response.Message) {
        setApiError({
          message: response?.Message || t('api_response_failed'),
          variant: 'danger',
        });
      }
      setDepositLoading(false);
      return false;
    },
    [t],
  );

  let alertMessage: { variant: string; msg: string | ReactElement } | undefined;
  if (apiError) {
    alertMessage = {
      variant: apiError.variant,
      msg: apiError.message,
    };
  } else if (
    ![DepositStatus.Pending, DepositStatus.None].includes(
      depositStatus.depositStatus,
    )
  ) {
    const depositSuccess = isDepositStatusSuccess(depositStatus.depositStatus);
    alertMessage = {
      variant: depositSuccess ? 'success' : 'danger',
      msg: (
        <>
          {depositStatus.message}
          <div>
            <u>{depositSuccess ? jsxT('cta_bet_now') : jsxT('cta_deposit')}</u>
          </div>
        </>
      ),
    };
  } else if ((Franchise.gnogaz || Franchise.desertDiamond) && validatorNotOk) {
    alertMessage = {
      variant: 'danger',
      msg: t('deposit_page_unverified_message'),
    };
  }

  const depositFrame = useMemo(() => {
    if (!customHtml) return null;
    if (customHtml.iframe)
      return (
        <StyledIframe
          title="Payment"
          allowTransparency
          onLoad={() => {
            setDepositLoading(false);
          }}
          onError={() => {
            setDepositLoading(false);
            setCustomHtml(null);
          }}
          ref={ref => {
            if (
              ref &&
              customHtml &&
              !ref.contentWindow?.document?.body?.innerHTML.length
            ) {
              ref?.contentWindow?.document.open();
              ref?.contentWindow?.document.write(customHtml.html);
              ref?.contentWindow?.document.close();
            }
          }}
        />
      );
    return <div>{replaceStringTagsReact(customHtml.html)}</div>;
  }, [customHtml]);

  return (
    <main
      className={clsx(
        !depositForm && 'container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5',
      )}
    >
      {!depositForm && <BalancesContainer />}
      {!depositForm && (
        <h1 className="account-settings__title">
          {jsxT('deposit_page_title')}
        </h1>
      )}
      {Franchise.strive && (
        <>
          <p className="mb-4">{jsxT('deposit_page_sub_text')}</p>
          <div className="play-responsible-block mb-3 px-2">
            <i className={clsx(`icon-${window.__config__.name}-thumbs`)}></i>
            {jsxT('play_responsible_block_link')}
          </div>
        </>
      )}
      {!depositForm && (
        <>
          <CustomAlert show={!!alertMessage} variant={alertMessage?.variant}>
            {alertMessage?.msg}
          </CustomAlert>
          <LoadingSpinner
            show={
              depositStatus.depositStatus === DepositStatus.Pending ||
              depositLoading
            }
            className="d-block mx-auto my-4"
          />
        </>
      )}
      {customHtml ? (
        depositFrame
      ) : (
        <DepositForm
          depositRequest={handleRequestDeposit}
          disabled={
            user.validator_status ===
              KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataOnly ||
            depositStatus.depositStatus === DepositStatus.Pending ||
            !depositForm ||
            ((Franchise.gnogaz || Franchise.desertDiamond) && validatorNotOk)
          }
          loading={depositLoading && !depositForm}
          setApiError={(message: string | null) =>
            setApiError(message ? { message, variant: 'danger' } : null)
          }
        />
      )}
      {!depositForm && (
        <>
          <QuestionsContainer items={questionItems} />
          <HelpBlock
            title={'user_help_title'}
            blocks={['faq', 'phone', 'email']}
            className="d-block d-xl-none"
          />
        </>
      )}
    </main>
  );
};

export default DepositPage;
