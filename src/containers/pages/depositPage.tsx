import React, { useCallback, useMemo, useState, useEffect } from 'react';
import InputContainer from '../../components/account-settings/InputContainer';
import QuestionsContainer from '../../components/account-settings/QuestionsContainer';
import { postApi } from '../../utils/apiUtils';
import { useParams } from 'react-router-dom';
import { DepositRequest, DepositResponse } from '../../types/api/user/Deposit';
import { useToasts } from 'react-toast-notifications';
import { useI18n } from '../../hooks/useI18n';
import { ComponentName, PagesName } from '../../constants';
import CustomAlert from '../../components/CustomAlert';
import useUserBankAccountModal from '../../hooks/useUserBankAccountModal';
import { usePrevious, useRoutePath } from '../../hooks';
import { useModal } from '../../hooks/useModal';
import { useAuth } from '../../hooks/useAuth';
import { VALIDATOR_STATUS } from '../../types/UserStatus';

const DepositPage = () => {
  const { addToast } = useToasts();
  const { user } = useAuth();
  const bankAccount = useUserBankAccountModal();
  const { enableModal, allActiveModals } = useModal();
  const { t } = useI18n();
  const { bankResponse } = useParams<{ bankResponse?: string }>();
  const [depositLoading, setDepositLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const depositBaseUrl = useRoutePath(PagesName.DepositPage, true);
  const addBankAccountModalActivePrevious = usePrevious(
    allActiveModals.includes(ComponentName.AddBankAccountModal),
  );

  useEffect(() => {
    if (
      user.logged_in &&
      user.validator_status !== VALIDATOR_STATUS.MAJOR_ERROR &&
      !bankAccount.loading &&
      !bankAccount.hasBankAccount
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
    }
  }, [allActiveModals]);

  const questionItems = useMemo(
    () => [
      { title: t('deposit_question_1'), body: 'deposit_answer_1' },
      { title: t('deposit_question_2'), body: 'deposit_answer_2' },
    ],
    [t],
  );

  const handleRequestDeposit = useCallback(async (depositValue: number) => {
    setApiError(null);
    if (!bankAccount.loading && !bankAccount.hasBankAccount) {
      addToast(`No bank account`, {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }
    setDepositLoading(true);
    const depositParams: DepositRequest = {
      BankId: 160,
      Amount: depositValue,
      ReturnSuccessUrl: `${window.location.origin}${depositBaseUrl}/success`,
      ReturnCancelUrl: `${window.location.origin}${depositBaseUrl}/cancel`,
      ReturnErrorUrl: `${window.location.origin}${depositBaseUrl}/error`,
    };
    const response: DepositResponse | null = await postApi<DepositResponse>(
      '/railsapi/v1/deposits/perform',
      depositParams,
    ).catch(res => {
      return res;
    });
    console.log(response);
    if (response?.Success && response.RedirectUrl) {
      return !!(window.location.href = response.RedirectUrl);
    }
    if (!response || response.PaymentResultMessage || response.Message) {
      setApiError(
        response?.PaymentResultMessage ||
          response?.Message ||
          t('api_response_failed'),
      );
    }
    setDepositLoading(false);
    return false;
  }, []);

  return (
    <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
      <h1 className="mb-4">{t('deposit_page_title')}</h1>
      {/* <AmountContainer
        title={t('total_playable_amount')}
        amount={user.balance!}
        tooltip={t('playable_amount_tooltip')}
      /> */}
      <CustomAlert show={!!apiError} variant="danger">
        {apiError}
      </CustomAlert>
      {!!bankResponse && (
        <div className="amount-container mb-4">
          <h2 className="amount-container__amount">
            {t(`deposit_page_${bankResponse.toLocaleLowerCase()}`)}
          </h2>
        </div>
      )}
      <InputContainer
        title={t('select_amount')}
        defaultValue="0"
        buttonText={t('deposit_btn')}
        loading={depositLoading}
        onSubmit={handleRequestDeposit}
        quickAmounts={[10, 20, 50, 100]}
        currency={user.currency}
        disabled={
          !bankAccount.hasBankAccount ||
          user.validator_status === VALIDATOR_STATUS.MAJOR_ERROR
        }
      />
      <div className="info-container mb-4">
        <p className="info-container__info text-14 mb-0">
          {t('deposit_to_bank_info')}
        </p>
        <div className="info-container__text">
          <ul className="list-unstyled mb-0">
            <li className="mb-1">
              {t('deposit_iban')}:{' '}
              <span className="font-weight-bold">
                {t('deposit_bank_iban_data')}
              </span>
            </li>
            <li className="mb-1">
              {t('deposit_bank_account')}:{' '}
              <span className="font-weight-bold">
                {t('deposit_bank_account')}
              </span>
            </li>
            <li className="mb-1">
              {t('deposit_bank_code')}:{' '}
              <span className="font-weight-bold">
                {t('deposit_bank_code_data')}
              </span>
            </li>
            <li className="mb-1">
              {t('deposit_bank_title')}:{' '}
              <span className="font-weight-bold">
                {t('deposit_bank_title_data')}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <QuestionsContainer items={questionItems} />
    </main>
  );
};

export default DepositPage;
