import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { useRoutePath } from '.';
import { PagesName } from '../constants';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { DepositStatus } from '../types/api/user/Deposit';
import { postApi } from '../utils/apiUtils';
import useApi from './useApi';
import { useAuth } from './useAuth';
import { useI18n } from './useI18n';
import useLocalStorage from './useLocalStorage';
import * as Sentry from '@sentry/react';

const postUrl = '/restapi/v1/deposits/status';

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

  const { data, error } = useApi<RailsApiResponse<{}>>(request, postApi, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (bankId && queryParams && Object.keys(queryParams).length) {
      postApi<RailsApiResponse<null>>('/restapi/v1/deposits/request_return', {
        bank_id: bankId.toString(),
        data: JSON.stringify({
          ...queryParams,
          depositRequestId: id,
        }),
      })
        .then(res => {
          if (res.Success) {
            history.replace({
              search: '',
            });
          } else {
            Sentry.captureMessage(
              `Request return deposit error bankId: ${bankId}`,
              {
                level: Sentry.Severity.Fatal,
                tags: {
                  searchQuery: window.location.search,
                },
              },
            );
            setId(null);
            setBankId(null);
            history.replace(`${depositBaseUrl}/error`, {
              status: DepositStatus.Errored,
            });
          }
        })
        .catch(() => {});
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
      timer = setTimeout(() => setDepositStatus(DepositStatus.Timeout), 60000); // 1min
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
      if (DepositStatus.Confirmed === status) updateUser();
      if (
        ![DepositStatus.None, DepositStatus.Pending].includes(status) &&
        bankResponse &&
        !queryParams
      ) {
        let newDepositPath = 'error';
        if (status === DepositStatus.Confirmed) newDepositPath = 'success';
        if (status === DepositStatus.Rejected) newDepositPath = 'rejected';
        if (status === DepositStatus.Canceled) newDepositPath = 'canceled';
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
    message = state?.message || jsxT(`deposit_status_${depositStatus}`);
  }
  return {
    setDepositId: (id: string | number, bankId?: number) => {
      setId(id);
      if (bankId) setBankId(bankId);
    },
    startCheckingStatus: () => {
      history.push(`${depositBaseUrl}/loading`);
    },
    error,
    depositStatus,
    message,
  };
};

export default useDepositResponseStatus;
