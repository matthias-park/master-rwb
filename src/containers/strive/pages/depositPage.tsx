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
  DepositLimits,
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
import useDepositResponseStatus from '../../../hooks/useDepositResponseStatus';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useGTM from '../../../hooks/useGTM';
import { useModal } from '../../../hooks/useModal';
import LoadingSpinner from '../../../components/LoadingSpinner';
import DepositForm from '../components/account-settings/DepositForm';
import useApi from '../../../hooks/useApi';
import StyledIframe from '../components/styled/StyledDepositIframe';
import * as Sentry from '@sentry/react';
import BalancesContainer from '../components/account-settings/BalancesContainer';
import clsx from 'clsx';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
import RequestReturn from '../../../types/api/deposits/RequestReturn';
import { injectTrackerScript } from '../../../utils/uiUtils';
import useLocalStorage from '../../../hooks/useLocalStorage';

const questionItems = [
  { title: 'deposit_question_1', body: 'deposit_answer_1' },
  { title: 'deposit_question_2', body: 'deposit_answer_2' },
];

const DepositPage = ({ depositForm }: { depositForm?: boolean }) => {
  const { user } = useAuth();
  const { t, jsxT } = useI18n();
  const { data: depositData, error: depositError } = useApi<
    RailsApiResponse<DepositLimits[] | null>
  >('/restapi/v1/user/max_deposit');
  const depositDataLoading = !depositData && !depositError;
  const [depositLoading, setDepositLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
      depositStatus.depositStatus === DepositStatus.Confirmed &&
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
    async (depositValue: number, bankId: number) => {
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
            err => {
              Sentry.captureEvent(err);
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
                          window.open(
                            res.Data.AdditionalData.redirectUrl,
                            '_blank',
                          );
                          disableModal(ComponentName.QuickDepositModal);
                        } else {
                          window.location.href =
                            res.Data.AdditionalData.redirectUrl;
                        }
                        return;
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
          let htmlString = atob(response.Data.InnerText);
          const iframeHtml = [180, 181, 182, 183].includes(bankId);
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
              setApiError(t('api_response_failed'));
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
        }
      }
      if (!response || !response.Success || response.Message) {
        setApiError(response?.Message || t('api_response_failed'));
      }
      setDepositLoading(false);
      return false;
    },
    [t],
  );

  let alertMessage: { variant: string; msg: string | ReactElement } | undefined;
  if (apiError) {
    alertMessage = { variant: 'danger', msg: apiError };
  } else if (
    ![DepositStatus.Pending, DepositStatus.None].includes(
      depositStatus.depositStatus,
    )
  ) {
    alertMessage = {
      variant:
        depositStatus.depositStatus === DepositStatus.Confirmed
          ? 'success'
          : 'danger',
      msg: (
        <>
          {depositStatus.message}
          <div>
            <u>
              {depositStatus.depositStatus === DepositStatus.Confirmed
                ? jsxT('cta_bet_now')
                : jsxT('cta_deposit')}
            </u>
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
    return replaceStringTagsReact(customHtml.html);
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
              depositDataLoading ||
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
            (depositDataLoading && !depositForm) ||
            ((Franchise.gnogaz || Franchise.desertDiamond) && validatorNotOk)
          }
          loading={depositLoading && !depositForm}
          setApiError={setApiError}
          depositData={depositData}
          depositError={!!depositError}
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
