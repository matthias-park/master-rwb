import React, { useEffect, useMemo, useState } from 'react';
import AmountContainer from '../../components/account-settings/AmountContainer';
import InputContainer from '../../components/account-settings/InputContainer';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import Spinner from 'react-bootstrap/Spinner';
import {
  Withdrawal,
  Request,
  WithdrawalConfirmation,
} from '../../types/api/user/Withdrawal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useCallback } from 'react';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import Alert from 'react-bootstrap/Alert';
import WithdrawalConfirmModal from '../../components/modals/WithdrawalConfirmModal';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { ComponentName } from '../../constants';
import { useUIConfig } from '../../hooks/useUIConfig';
import useApi from '../../hooks/useApi';

interface WithdrawalRequestsProps {
  requests: Request[];
  onCancelRequest: (id: number) => Promise<void>;
}

const WithdrawalRequests = ({
  requests,
  onCancelRequest,
}: WithdrawalRequestsProps) => {
  const { t } = useI18n();
  const [cancelLoading, setCancelLoading] = useState<number | null>(null);
  const handleCancel = async (id: number) => {
    setCancelLoading(id);
    await onCancelRequest(id);
    setCancelLoading(null);
  };
  return (
    <div className="d-flex flex-column">
      <div className="table-container d-flex flex-column mb-4">
        <Table hover>
          <thead>
            <tr>
              <th>ID</th>
              <th className="text-sm-center">Account</th>
              <th className="text-sm-center">Amount</th>
              <th className="d-block text-sm-right mr-1">Request cancel</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => {
              if (request.cancel_requested) return null;
              return (
                <tr key={index}>
                  <td>
                    <strong className="heading-sm">ID</strong>
                    {request.id}
                  </td>
                  <td className="text-sm-center">
                    <strong className="heading-sm">{t('action')}</strong>
                    {request.account}
                  </td>
                  <td className="text-sm-center">
                    <strong className="heading-sm">{t('account')}</strong>
                    {request.amount}
                  </td>
                  <td className="text-sm-right py-2">
                    <strong className="heading-sm">{t('amount')}</strong>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancel(request.id)}
                    >
                      {cancelLoading === request.id && (
                        <Spinner
                          data-testid="spinner"
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="mr-1"
                        />
                      )}
                      Cancel
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const WithdrawalPage = () => {
  const { t, set } = useI18n();
  const { user, locale } = useConfig();
  const { addToast } = useToasts();
  const { setShowModal } = useUIConfig();
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [
    withdrawalConfirmData,
    setWithdrawalConfirmData,
  ] = useState<WithdrawalConfirmation | null>(null);
  const { data, error, mutate } = useApi<RailsApiResponse<Withdrawal>>(
    '/railsapi/v1/withdrawals',
  );
  const isDataLoading = !data && !error;
  useEffect(() => {
    if (user.logged_in && !user.bank_account) {
      setShowModal(ComponentName.AddBankAccountModal);
    } else {
      mutate();
    }
  }, [user.bank_account]);
  useEffect(() => {
    if (data?.Data.translations) {
      set(
        locale,
        Object.keys(data.Data.translations).reduce((obj, key) => {
          obj[`withdrawal_page_${key}`] = data.Data.translations![key];
          return obj;
        }, {}),
      );
    }
  }, [data]);
  const cancelRequest = useCallback(
    async (id: number): Promise<void> => {
      const response = await postApi<RailsApiResponse<null>>(
        '/railsapi/v1/withdrawals/cancel',
        {
          request_id: id,
        },
      ).catch((res: RailsApiResponse<null>) => {
        if (res.Fallback) {
          addToast('failed to cancel withdraw', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
        return res;
      });
      mutate();
      return setSubmitResponse({
        success: response.Success,
        msg: response.Message,
      });
    },
    [user],
  );
  const requestWithdrawal = useCallback(
    async (amount: number) => {
      setWithdrawalLoading(true);
      if (!data?.Data.default_account) {
        return addToast('account not found for withdrawal', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      const response = await postApi<
        WithdrawalConfirmation | Withdrawal | null
      >('/railsapi/v1/withdrawals', {
        amount: amount.toString(),
        id: data?.Data.default_account.uniq_id,
      }).catch(() => {
        addToast('failed to withdraw amount', {
          appearance: 'error',
          autoDismiss: true,
        });
        return null;
      });
      setWithdrawalLoading(false);
      // if (response && (response as Withdrawal)?.error) {
      //   return mutate(response as Withdrawal, false);
      // } else if (response) {
      // const { error, ...withoutErrorData } = data!;
      mutate(data, false);
      return setWithdrawalConfirmData(response as WithdrawalConfirmation);
      // }
    },
    [data?.Data.default_account, user],
  );
  const confirmWithdrawal = useCallback(
    async (data: any) => {
      setWithdrawalLoading(true);
      const response = await postApi<RailsApiResponse<null>>(
        '/railsapi/v1/withdrawals/confirm',
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
      setWithdrawalLoading(false);
      setWithdrawalConfirmData(null);
      mutate();
      return setSubmitResponse({
        success: response.Success,
        msg: response.Message,
      });
    },
    [data?.Data.default_account, user],
  );
  const questionItems = useMemo(
    () => [
      { title: t('withdrawal_question_1'), body: 'withdrawal_answer_1' },
      { title: t('withdrawal_question_2'), body: 'withdrawal_answer_2' },
    ],
    [t],
  );
  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {data && (
        <>
          <h1 className="mb-4">{data.Data.title}</h1>
          <AmountContainer
            title={t('total_playable_amount')}
            amount={user.balance!}
            tooltip={t('playable_amount_tooltip')}
          />
          {(!data?.Data.default_account || submitResponse) && (
            <Alert
              show
              variant={
                submitResponse
                  ? submitResponse.success
                    ? 'success'
                    : 'danger'
                  : !data?.Data.default_account
                  ? 'info'
                  : 'danger'
              }
            >
              {submitResponse?.msg || data.Message}
            </Alert>
          )}
          <InputContainer
            title={t('withdrawal_amount')}
            placeholder={`${user.currency || ''} 0`}
            buttonText={t('withdrawal_btn')}
            min={data.Data.default_account?.min_withdraw_amount}
            max={data.Data.default_account?.max_withdraw_amount}
            loading={!withdrawalConfirmData && withdrawalLoading}
            onSubmit={requestWithdrawal}
            disabled={!data?.Data.default_account}
            currency={user.currency}
          />
          {!!data.Data.default_account && (
            <div className="info-container mb-4">
              {/* <p className="info-container__info pb-0 mb-n1">
              <strong>Your bank account number</strong>
            </p> */}
              <p
                className="info-container__info text-14 mb-0"
                dangerouslySetInnerHTML={{ __html: data.Data.info }}
              />
              <div className="info-container__text">
                <ul className="list-unstyled mb-0">
                  <li className="mb-1">Your current bank account number:</li>
                  <li className="mb-1">{data.Data.default_account.uniq_id}</li>
                </ul>
              </div>
            </div>
          )}
          {!!data.Data.requests && (
            <WithdrawalRequests
              onCancelRequest={cancelRequest}
              requests={data.Data.requests}
            />
          )}
          <QuestionsContainer items={questionItems} />
        </>
      )}
      {withdrawalConfirmData && (
        <WithdrawalConfirmModal
          data={withdrawalConfirmData}
          onCancel={() => setWithdrawalConfirmData(null)}
          onConfirm={confirmWithdrawal}
          loading={withdrawalLoading}
        />
      )}
    </main>
  );
};

export default WithdrawalPage;
