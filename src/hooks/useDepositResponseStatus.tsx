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

const postUrl = '/restapi/v1/deposits/status';

const useDepositResponseStatus = () => {
  const { jsxT } = useI18n();
  const { updateUser } = useAuth();
  const { bankResponse } = useParams<{ bankResponse?: string }>();
  const { pathname, state } = useLocation<{
    status: DepositStatus;
    message: string | null;
  } | null>();
  const history = useHistory();
  const depositBaseUrl = useRoutePath(PagesName.DepositPage, true);
  const responseLoading = bankResponse === 'loading';
  const responseCanceled = bankResponse === 'cancel';
  const [id, setId] = useLocalStorage<number | string | null>(
    'deposit_id',
    null,
  );
  const [depositStatus, setDepositStatus] = useState<DepositStatus>(
    state?.status ?? DepositStatus.None,
  );
  const request = useMemo(() => {
    if (
      id &&
      responseLoading &&
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
  }, [responseLoading, id, depositStatus]);
  const { data, error } = useApi<RailsApiResponse<{}>>(request, postApi, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (bankResponse && !responseLoading && !responseCanceled && !state) {
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
    if (
      (responseLoading || responseCanceled) &&
      (status !== depositStatus || status === DepositStatus.Timeout)
    ) {
      setDepositStatus(status);
      if (DepositStatus.Confirmed === status) updateUser();
      if (
        ![DepositStatus.None, DepositStatus.Pending].includes(status) &&
        bankResponse
      ) {
        let newDepositPath = 'error';
        if (status === DepositStatus.Confirmed) newDepositPath = 'success';
        if (status === DepositStatus.Rejected) newDepositPath = 'rejected';
        if (status === DepositStatus.Canceled) newDepositPath = 'canceled';
        setId(null);
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
    setDepositId: (id: string | number) => setId(id),
    error,
    depositStatus,
    message,
  };
};

export default useDepositResponseStatus;
