import React, { useEffect, useMemo, useState } from 'react';
import AmountContainer from '../../components/account-settings/AmountContainer';
import InputContainer from '../../components/account-settings/InputContainer';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import { useUIConfig } from '../../hooks/useUIConfig';
import useSWR from 'swr';
import Spinner from 'react-bootstrap/Spinner';
import {
  Withdrawal,
  Request,
  RequestWithdrawalResponse,
  WithdrawalConfirmation,
  WithdrawalConfirmationParams,
} from '../../types/api/user/Withdrawal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useCallback } from 'react';
import { postApi } from '../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';

interface WithdrawalRequestsProps {
  requests: Request[];
  onCancelRequest: (id: number) => Promise<void>;
}

const WithdrawalRequests = ({
  requests,
  onCancelRequest,
}: WithdrawalRequestsProps) => {
  const { t } = useI18n();

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
              return (
                <tr key={index}>
                  <td>
                    <strong className="heading-sm">{t('_date')}</strong>
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
                      onClick={() => onCancelRequest(request.id)}
                    >
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

interface WithdrawalConfirmProps {
  data: WithdrawalConfirmation;
  onCancel: () => void;
  onConfirm: (data: WithdrawalConfirmationParams) => void;
  loading?: boolean;
}

const WithdrawalConfirm = ({
  data,
  onCancel,
  onConfirm,
  loading,
}: WithdrawalConfirmProps) => {
  const { t } = useI18n();
  return (
    <Modal show={true} onHide={onCancel} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('withdrawal_page_withdrawal_confirm')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {Object.keys(data.confirm_info).map(key => (
          <div key={key}>
            {t(`withdrawal_page_${key}`)}: {data.confirm_info[key]}
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onCancel} variant="secondary" className="mx-auto">
          {t('withdrawal_page_cancel')}
        </Button>
        <Button
          onClick={() => {
            onConfirm(data.params);
          }}
          variant="primary"
          className="mx-auto"
        >
          {loading && (
            <Spinner
              data-testid="spinner"
              as="span"
              animation="border"
              size="sm"
              role="status"
              className="mr-1"
            />
          )}
          {t('withdrawal_page_confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const WithdrawalPage = () => {
  const { t, set } = useI18n();
  const { user, locale } = useConfig();
  const { contentStyle } = useUIConfig();
  const { addToast } = useToasts();
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [
    withdrawalConfirmData,
    setWithdrawalConfirmData,
  ] = useState<WithdrawalConfirmation | null>(null);
  const { data, error, mutate } = useSWR<Withdrawal>('/v2/withdraw.json');
  const isDataLoading = !data && !error;
  useEffect(() => {
    if (data?.translations) {
      set(
        locale,
        Object.keys(data.translations).reduce((obj, key) => {
          obj[`withdrawal_page_${key}`] = data.translations[key];
          return obj;
        }, {}),
      );
    }
  }, [data]);
  const defaultAccount = useMemo(() => {
    if (!data) return null;
    const accountField = data.fields.find(field => field.id === 'id');
    if (!accountField?.values?.length) return null;
    return accountField.values[accountField.default || 0];
  }, [data]);
  const cancelRequest = useCallback(
    async (id: number): Promise<void> => {
      const response = await postApi('/v2/withdraw/cancel.json', {
        authenticity_token: user.token!,
        request_id: id,
      }).catch(() => {
        addToast('failed to cancel withdraw', {
          appearance: 'error',
          autoDismiss: true,
        });
      });
      console.log(response);
    },
    [user],
  );
  const requestWithdrawal = useCallback(
    async (amount: number) => {
      setWithdrawalLoading(true);
      if (!defaultAccount) {
        return addToast('account not found for withdrawal', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      const response = await postApi<
        RequestWithdrawalResponse | Withdrawal | null
      >('/v2/withdraw.json', {
        authenticity_token: user.token!,
        amount: amount.toString(),
        id: defaultAccount!.id,
      }).catch(() => {
        addToast('failed to withdraw amount', {
          appearance: 'error',
          autoDismiss: true,
        });
        return null;
      });
      setWithdrawalLoading(false);
      if (response && (response as Withdrawal)?.error) {
        return mutate(response as Withdrawal, false);
      } else if (response) {
        const { error, ...withoutErrorData } = data!;
        mutate(withoutErrorData, false);
        setWithdrawalConfirmData(
          (response as RequestWithdrawalResponse).confirmation,
        );
      }
    },
    [defaultAccount, user],
  );
  const confirmWithdrawal = useCallback(
    async (data: any) => {
      setWithdrawalLoading(true);
      const response = await postApi<RequestWithdrawalResponse | null>(
        '/v2/withdraw.json',
        { ...data, authenticity_token: user.token! },
        {
          formData: true,
        },
      ).catch(() => {
        addToast('failed to withdraw amount', {
          appearance: 'error',
          autoDismiss: true,
        });
        return null;
      });
      setWithdrawalLoading(false);
      console.log(response);
    },
    [defaultAccount, user],
  );
  const questionItems = useMemo(
    () => [
      { title: t('withdrawal_question_1'), body: 'withdrawal_answer_1' },
      { title: t('withdrawal_question_2'), body: 'withdrawal_answer_2' },
    ],
    [t],
  );
  return (
    <main
      style={contentStyle.styles}
      className="container-fluid px-0 pr-sm-4 pl-sm-5 mb-4"
    >
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {data && (
        <>
          <h1 className="mb-4">{data.title}</h1>
          <AmountContainer
            title={t('total_playable_amount')}
            amount={user.balance!}
            tooltip={t('playable_amount_tooltip')}
          />
          {(!!data.error || !defaultAccount) && (
            <Alert show variant={!defaultAccount ? 'info' : 'danger'}>
              {data.error || data.note}
            </Alert>
          )}
          <InputContainer
            title={t('withdrawal_amount')}
            placeholder="€ 300"
            buttonText={t('withdrawal_btn')}
            min={defaultAccount?.set_values.min_withdraw.split(' ')?.[0]}
            max={defaultAccount?.set_values.max_withdraw.split(' ')?.[0]}
            loading={!withdrawalConfirmData && withdrawalLoading}
            onSubmit={requestWithdrawal}
            disabled={!defaultAccount}
          />
          <div className="info-container mb-4">
            {/* <p className="info-container__info pb-0 mb-n1">
              <strong>Your bank account number</strong>
            </p> */}
            <p
              className="info-container__info text-14 mb-0"
              dangerouslySetInnerHTML={{ __html: data.info }}
            />
            {!!defaultAccount && (
              <div className="info-container__text">
                <ul className="list-unstyled mb-0">
                  <li className="mb-1">Your current bank account number:</li>
                  <li className="mb-1">{defaultAccount?.id}</li>
                </ul>
              </div>
            )}
          </div>
          {!!data.requests && (
            <WithdrawalRequests
              onCancelRequest={cancelRequest}
              requests={data.requests}
            />
          )}
          <QuestionsContainer items={questionItems} />
        </>
      )}
      {withdrawalConfirmData && (
        <WithdrawalConfirm
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
