import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { useRoutePath } from '.';
import { Franchise, PagesName } from '../constants';
import RailsApiResponse from '../types/api/RailsApiResponse';
import {
  DepositStatus,
  DepositStatusData,
  UnverifiedDepositReason,
} from '../types/api/user/Deposit';
import { postApi } from '../utils/apiUtils';
import useApi from './useApi';
import { useAuth } from './useAuth';
import { useI18n } from './useI18n';
import useLocalStorage from './useLocalStorage';
import * as Sentry from '@sentry/react';
import { Transaction } from '@sentry/types';
import RequestReturn from '../types/api/deposits/RequestReturn';

export const isDepositStatusSuccess = (status: DepositStatus) =>
  [
    DepositStatus.Confirmed,
    DepositStatus.ConfirmedMismatch,
    DepositStatus.ConfirmedAndReconciled,
  ].includes(status);

const postUrl = '/restapi/v1/deposits/status';
let DepositStatusTransaction: Transaction | null = null;

const useDepositResponseStatus = () => {
  const { jsxT } = useI18n();
  const { updateUser } = useAuth();
  const { bankResponse } = useParams<{ bankResponse?: string }>();
  const { pathname, state, search } = useLocation<{
    status: DepositStatus;
    message: string | null;
  } | null>();
  const history = useHistory();
  const depositBaseUrl = useRoutePath(PagesName.DepositPage, true);
  const responseLoading = bankResponse === 'loading';
  const responseCanceled = bankResponse === 'cancel';
  const responseError = bankResponse === 'error';
  const [id, setId] = useLocalStorage<number | string | null>(
    'deposit_id',
    null,
  );
  const [bankId, setBankId] = useLocalStorage<number | null>(
    'deposit_bank_id',
    null,
  );
  const queryParams = useMemo(
    () =>
      search && bankId ? Object.fromEntries(new URLSearchParams(search)) : null,
    [search],
  );
  const [depositStatus, setDepositStatus] = useState<DepositStatus>(
    state?.status ?? DepositStatus.None,
  );
  const request = useMemo(() => {
    if (
      id &&
      responseLoading &&
      !queryParams &&
      [DepositStatus.None, DepositStatus.Pending].includes(depositStatus)
    ) {
      return [
        postUrl,
        {
          id,
        },
      ];
    }
    return null;
  }, [responseLoading, id, depositStatus, queryParams]);

  const { data, error } = useApi<RailsApiResponse<DepositStatusData>>(
    request,
    (url, body) =>
      postApi(url, body, {
        sentryScope: DepositStatusTransaction,
      }),
    {
      refreshInterval: 5000,
      dedupingInterval: 1000,
      focusThrottleInterval: 5000,
    },
  );

  useEffect(() => {
    if (responseLoading) {
      if (!DepositStatusTransaction && bankId) {
        DepositStatusTransaction = Sentry.startTransaction({
          name: 'deposit status check',
          tags: {
            'deposit.bank.id': bankId,
            'deposit.id': id,
          },
        });
      }
      if (bankId && queryParams && Object.keys(queryParams).length) {
        postApi<RailsApiResponse<RequestReturn>>(
          '/restapi/v1/deposits/request_return',
          {
            bank_id: bankId.toString(),
            data: JSON.stringify({
              ...queryParams,
              depositRequestId: id,
            }),
          },
          {
            sentryScope: DepositStatusTransaction,
          },
        )
          .then(res => {
            if (res.Success) {
              Sentry.addBreadcrumb({
                category: 'Deposit',
                message: `Request return success`,
                level: Sentry.Severity.Log,
              });
              history.replace({
                search: '',
              });
            } else {
              Sentry.addBreadcrumb({
                category: 'Deposit',
                message: `Request return error`,
                level: Sentry.Severity.Error,
                data: res.Data,
              });
              Sentry.captureMessage('Request return deposit failed', {
                level: Sentry.Severity.Fatal,
                tags: {
                  searchQuery: window.location.search,
                },
              });
              setId(null);
              setBankId(null);
              history.replace(`${depositBaseUrl}/error`, {
                status: DepositStatus.Errored,
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [queryParams]);

  useEffect(() => {
    if (
      bankResponse &&
      !responseLoading &&
      !responseCanceled &&
      !responseError &&
      !state
    ) {
      history.replace(depositBaseUrl);
    }
  }, [bankResponse]);

  useEffect(() => {
    let timer: number | undefined;
    if (request) {
      timer = setTimeout(() => {
        Sentry.addBreadcrumb({
          category: 'Deposit',
          message: `status checking timeout`,
          level: Sentry.Severity.Warning,
        });
        setDepositStatus(DepositStatus.Timeout);
      }, 120000); // 2min
    }
    return () => {
      clearTimeout(timer);
    };
  }, [request]);

  useEffect(() => {
    let status = DepositStatus.Pending;
    if (!responseLoading || !id) {
      status = DepositStatus.None;
    } else if (!id && !state?.status) {
      status = DepositStatus.NotFound;
    } else if (data?.Code !== undefined) {
      status = data.Code;
      if (
        Franchise.xCasino &&
        data.Code === DepositStatus.Unverified &&
        data.Data.UnverifiedDepositReason ===
          UnverifiedDepositReason.FirstDepositNotFromMainAccount
      ) {
        status = DepositStatus.FirstDepositNotFromMainAccount;
      }
    }
    if (depositStatus === DepositStatus.Timeout) status = depositStatus;
    if (responseCanceled) status = DepositStatus.Canceled;
    if (responseError && depositStatus === DepositStatus.None) {
      status = DepositStatus.Errored;
    }
    if (
      (responseLoading ||
        responseCanceled ||
        status === DepositStatus.Errored) &&
      (status !== depositStatus || status === DepositStatus.Timeout)
    ) {
      setDepositStatus(status);
      if (isDepositStatusSuccess(status)) updateUser();
      if (
        ![DepositStatus.None, DepositStatus.Pending].includes(status) &&
        bankResponse &&
        !queryParams
      ) {
        let newDepositPath = 'error';
        if (isDepositStatusSuccess(status)) newDepositPath = 'success';
        if (status === DepositStatus.Rejected) newDepositPath = 'rejected';
        if (status === DepositStatus.Canceled) newDepositPath = 'canceled';
        if (DepositStatusTransaction) {
          DepositStatusTransaction.setTag('deposit.status', status);
          DepositStatusTransaction.finish();
          DepositStatusTransaction = null;
        }
        setId(null);
        setBankId(null);
        const newPathname = pathname.replace(bankResponse, newDepositPath);
        history.replace(newPathname, {
          status: status,
          message: data?.Message,
        });
      }
    } else if (responseLoading && !id && status === DepositStatus.None) {
      history.replace(depositBaseUrl);
    }
  }, [data, updateUser, depositStatus]);
  let message: string | JSX.Element | JSX.Element[] = '';
  if (depositStatus !== DepositStatus.None) {
    message = jsxT(`deposit_status_${depositStatus}`, true) || state?.message;
  }
  return {
    setDepositId: (id: string | number, bankId?: number) => {
      setId(id);
      if (bankId) setBankId(bankId);
    },
    startCheckingStatus: () => {
      history.replace(`${depositBaseUrl}/loading`);
    },
    error,
    depositStatus,
    message,
  };
};

export default useDepositResponseStatus;
