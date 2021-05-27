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
} from '../../../types/api/user/Withdrawal';
import Table from 'react-bootstrap/Table';
import { useCallback } from 'react';
import { postApi } from '../../../utils/apiUtils';
import { useToasts } from 'react-toast-notifications';
import CustomAlert from '../components/CustomAlert';
import WithdrawalConfirmModal from '../components/modals/WithdrawalConfirmModal';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { ComponentName } from '../../../constants';
import useApi from '../../../hooks/useApi';
import LoadingButton from '../../../components/LoadingButton';
import { useModal } from '../../../hooks/useModal';
import { usePrevious } from '../../../hooks';
import useUserBankAccountModal from '../../../hooks/useUserBankAccountModal';
import { useAuth } from '../../../hooks/useAuth';
import { VALIDATOR_STATUS } from '../../../types/UserStatus';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
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

const WithdrawalPage = () => {
  const { t, addSymbols } = useI18n();
  const { user, updateUser } = useAuth();
  const { addToast } = useToasts();
  const { enableModal, allActiveModals } = useModal();
  const bankAccount = useUserBankAccountModal();
  const [submitResponse, setSubmitResponse] = useState<{
    success: boolean;
    msg: string | null;
  } | null>(null);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [
    withdrawalConfirmData,
    setWithdrawalConfirmData,
  ] = useState<WithdrawalConfirmation | null>(null);
  const addBankAccountModalActivePrevious = usePrevious(
    allActiveModals.includes(ComponentName.AddBankAccountModal),
  );
  const { data, error, mutate } = useApi<RailsApiResponse<Withdrawal>>(
    '/railsapi/v1/withdrawals',
  );
  const isDataLoading = !data && !error;
  useEffect(() => {
    if (
      user.logged_in &&
      user.validator_status !== VALIDATOR_STATUS.MAJOR_ERROR &&
      !bankAccount.loading &&
      !bankAccount.hasBankAccount &&
      !bankAccount.error
    ) {
      enableModal(ComponentName.AddBankAccountModal);
    }
  }, [bankAccount.loading]);
  useEffect(() => {
    if (
      !allActiveModals.includes(ComponentName.AddBankAccountModal) &&
      addBankAccountModalActivePrevious
    ) {
      bankAccount.refresh();
      mutate();
    }
  }, [allActiveModals]);
  useEffect(() => {
    if (data?.Data.translations) {
      addSymbols(
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
      const response = await postApi<RailsApiResponse<WithdrawalConfirmation>>(
        '/railsapi/v1/withdrawals',
        {
          amount: amount.toString(),
          id: data?.Data.default_account.uniq_id,
        },
      ).catch(() => {
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
      return setWithdrawalConfirmData(response?.Data || null);
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
      updateUser();
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
            <CustomAlert
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
            </CustomAlert>
          )}
          <InputContainer
            title={t('withdrawal_amount')}
            inputTitle={t('withdrawal_input_amount')}
            defaultValue="0"
            validationErrorPrefix="withdrawal_"
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
              <p className="info-container__info text-14 mb-0">
                {replaceStringTagsReact(data.Data.info || '')}
              </p>
              <div className="info-container__text">
                <ul className="list-unstyled mb-0">
                  <li className="mb-1">{t('withdrawal_bank_account')}</li>
                  <li className="mb-1">{data.Data.default_account.account}</li>
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
