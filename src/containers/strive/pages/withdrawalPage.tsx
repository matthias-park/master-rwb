import React, { useEffect, useMemo, useState } from 'react';
import AmountContainer from '../components/account-settings/AmountContainer';
import InputContainer from '../components/account-settings/InputContainer';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';
import HelpBlock from '../components/HelpBlock';
import { useI18n } from '../../../hooks/useI18n';
import Spinner from 'react-bootstrap/Spinner';
import {
  Withdrawal,
  Request,
  WithdrawalConfirmation,
  BankAccount,
} from '../../../types/api/user/Withdrawal';
import Table from 'react-bootstrap/Table';
import { useCallback } from 'react';
import { postApi } from '../../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import CustomAlert from '../components/CustomAlert';
import WithdrawalConfirmModal from '../components/modals/WithdrawalConfirmModal';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import LoadingButton from '../../../components/LoadingButton';
import { useAuth } from '../../../hooks/useAuth';
import useGTM from '../../../hooks/useGTM';
import PaymentMethods from '../components/account-settings/PaymentMethods';
import { useDispatch } from 'react-redux';
import { addSymbols } from '../../../state/reducers/translations';
import { KYC_VALIDATOR_STATUS } from '../../../types/UserStatus';
import BalancesContainer from '../components/account-settings/BalancesContainer';
import { Franchise } from '../../../constants';
import clsx from 'clsx';

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
    <div
      className={clsx(
        (Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon) &&
          'outer-info-block mb-4',
        'd-flex flex-column',
      )}
    >
      <div
        className={clsx(
          !Franchise.desertDiamond &&
            !Franchise.gnogaz &&
            !Franchise.gnogon &&
            'mb-4',
          'table-container d-flex flex-column',
        )}
      >
        <Table>
          <thead>
            <tr>
              <th>{t('withdrawal_requests_id')}</th>
              <th className="text-sm-center">
                {t('withdrawal_requests_account')}
              </th>
              <th className="text-sm-center">
                {t('withdrawal_requests_amount')}
              </th>
              <th className="d-block text-sm-right mr-1">
                {t('withdrawal_requests_cancel')}
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => {
              return (
                <tr key={index}>
                  <td>
                    <strong className="heading-sm">
                      {t('withdrawal_requests_id')}
                    </strong>
                    {request.id}
                  </td>
                  <td className="text-sm-center">
                    <strong className="heading-sm">
                      {t('withdrawal_requests_account')}
                    </strong>
                    {request.account}
                  </td>
                  <td className="text-sm-center">
                    <strong className="heading-sm">
                      {t('withdrawal_requests_amount')}
                    </strong>
                    {request.amount}
                  </td>
                  <td className="text-sm-right py-2">
                    <strong className="heading-sm">
                      {t('withdrawal_requests_cancel')}
                    </strong>
                    {!request.is_used && (
                      <LoadingButton
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancel(request.id)}
                        disabled={request.cancel_requested}
                        loading={cancelLoading === request.id}
                      >
                        {t('withdrawal_requests_cancel_btn')}
                      </LoadingButton>
                    )}
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

const questionItems = [
  { title: 'withdrawal_question_1', body: 'withdrawal_answer_1' },
  { title: 'withdrawal_question_2', body: 'withdrawal_answer_2' },
];

const WithdrawalPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { addToast } = useToasts();
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const dispatch = useDispatch();
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);
  const [
    withdrawalConfirmData,
    setWithdrawalConfirmData,
  ] = useState<WithdrawalConfirmation | null>(null);
  const sendDataToGTM = useGTM();
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

  const cancelRequest = useCallback(
    async (id: number): Promise<void> => {
      const response = await postApi<RailsApiResponse<null>>(
        '/restapi/v1/withdrawals/cancel',
        {
          request_id: id,
        },
      ).catch((res: RailsApiResponse<null>) => res);

      sendDataToGTM({
        event: 'withdrawalCancelRequested',
        'tglab.withdrawal.id': id,
      });
      mutate();
      window.scrollTo(0, 0);
      return setSubmitResponse({
        success: response.Success,
        msg: response.Message,
      });
    },
    [user],
  );
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
      ).catch(() => null);
      setWithdrawalLoading(false);
      if (response?.Success && response.Data.confirm_info) {
        return setWithdrawalConfirmData(response?.Data || null);
      } else {
        setWithdrawalError(t('withdrawal_request_error'));
      }
    },
    [selectedBankAccount, user],
  );
  const confirmWithdrawal = useCallback(
    async (data: any) => {
      setWithdrawalLoading(true);
      const response = await postApi<RailsApiResponse<null>>(
        '/restapi/v1/withdrawals/confirm',
        data,
        {
          formData: true,
        },
      ).catch((res: RailsApiResponse<null>) => res);
      sendDataToGTM({
        event: 'withdrawalRequested',
        'tglab.withdrawal.amount': data.amount,
      });
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
  let alertMessage: { variant: string; msg: string } | undefined;
  if (withdrawalError) {
    alertMessage = { variant: 'danger', msg: withdrawalError };
  } else if (!data?.Data.accounts?.length && data?.Message)
    alertMessage = { variant: 'danger', msg: data.Message };
  else if (submitResponse?.msg)
    alertMessage = {
      variant: submitResponse.success ? 'success' : 'danger',
      msg: submitResponse.msg,
    };

  const kycValidationOkay = [
    KYC_VALIDATOR_STATUS.Success,
    KYC_VALIDATOR_STATUS.CanPlayAndShouldUpdatePersonalData,
    KYC_VALIDATOR_STATUS.ShouldUpdatePersonalDataOnly,
  ].includes(Number(user?.validator_status));

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3">
          <Spinner animation="border" className="spinner-custom mx-auto" />
        </div>
      )}
      {error && (
        <h2 className="mt-3 mb-5 text-center">{t('withdrawal_failed_load')}</h2>
      )}
      {data && (
        <>
          {(Franchise.desertDiamond ||
            Franchise.gnogaz ||
            Franchise.gnogon) && <BalancesContainer />}
          <h1 className="account-settings__title mb-4">{data.Data.title}</h1>
          {window.__config__.name === 'strive' && (
            <AmountContainer
              title={t('total_playable_amount')}
              amount={user.balance!}
              tooltip={t('playable_amount_tooltip')}
            />
          )}
          {alertMessage && (
            <CustomAlert show variant={alertMessage.variant}>
              {alertMessage.msg}
            </CustomAlert>
          )}
          <div className="d-flex flex-column w-100">
            {!!data.Data.accounts?.length && (
              <div className="input-container mb-4 py-3 px-4">
                <h6 className="input-container__title text-14 mb-3">
                  {t('withdrawal_available_accounts')}
                </h6>
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
              </div>
            )}
            <InputContainer
              title={t('withdrawal_amount')}
              inputTitle={t('withdrawal_input_amount')}
              defaultValue="0"
              validationErrorPrefix="withdrawal_"
              buttonText={t('withdrawal_btn')}
              min={selectedBankAccount?.min_withdraw_amount}
              max={
                selectedBankAccount?.max_withdraw_amount &&
                (selectedBankAccount.max_withdraw_amount <
                  Number(user.balances?.withdrawable_balance) ||
                  isNaN(Number(user.balances?.withdrawable_balance)))
                  ? selectedBankAccount.max_withdraw_amount
                  : user.balances?.withdrawable_balance
              }
              loading={!withdrawalConfirmData && withdrawalLoading}
              onSubmit={requestWithdrawal}
              disabled={!selectedBankAccount || !kycValidationOkay}
              currency={user.currency}
              quickAmounts={(() => {
                if (Franchise.desertDiamond || Franchise.gnogon) {
                  return [10, 20, 50, 100];
                } else if (Franchise.gnogaz) {
                  return [15, 20, 50, 100];
                } else {
                  return [];
                }
              })()}
            />
          </div>
          {!!data.Data.requests && (
            <WithdrawalRequests
              onCancelRequest={cancelRequest}
              requests={data.Data.requests}
            />
          )}
          <QuestionsContainer items={questionItems} />
          <HelpBlock
            title={'user_help_title'}
            blocks={['faq', 'phone', 'email']}
            className="d-block d-xl-none"
          />
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
