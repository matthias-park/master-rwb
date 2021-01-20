import React, { useCallback, useMemo, useState } from 'react';
import AmountContainer from 'components/account-settings/AmountContainer';
import InputContainer from 'components/account-settings/InputContainer';
import QuestionsContainer from 'components/account-settings/QuestionsContainer';
import { getApi, postApi } from '../../utils/apiUtils';
import { useParams } from 'react-router-dom';
import { DepositRequest, DepositResponse } from '../../types/api/user/Deposit';
import { useToasts } from 'react-toast-notifications';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';

const DepositPage = () => {
  const { addToast } = useToasts();
  const { user } = useConfig();
  const { t } = useI18n();
  const { bankResponse } = useParams<{ bankResponse?: string }>();
  const [depositLoading, setDepositLoading] = useState(false);

  const questionItems = useMemo(
    () => [
      { title: t('deposit_question_1'), body: 'deposit_answer_1' },
      { title: t('deposit_question_2'), body: 'deposit_answer_2' },
    ],
    [t],
  );

  const handleRequestDeposit = useCallback(async (depositValue: number) => {
    setDepositLoading(true);
    const userIp: any = await getApi('/check-cf-ip').catch(err => {
      addToast(`Failed to get ip, using fallback`, {
        appearance: 'warning',
        autoDismiss: true,
      });
      console.log(err);
      return {};
    });
    const depositParams: DepositRequest = {
      BankId: 160,
      Ip: userIp.ip || '0.0.0.0',
      Amount: depositValue,
      ReturnSuccessUrl: `${window.location.href}/success`,
      ReturnCancelUrl: `${window.location.href}/cancel`,
      ReturnErrorUrl: `${window.location.href}/error`,
    };
    const response: DepositResponse | null = await postApi<DepositResponse>(
      `/tgbetapi/franchises/38/players/_player_id_/deposit_request`,
      {
        tgbet_params: JSON.stringify(depositParams),
      },
    ).catch(err => {
      addToast(`Failed to redirect to bank`, {
        appearance: 'error',
        autoDismiss: true,
      });
      console.log(err);
      return null;
    });
    if (response?.Success) {
      return (window.location.href = response.RedirectUrl);
    }
    addToast(`Failed to redirect to bank`, {
      appearance: 'error',
      autoDismiss: true,
    });
    console.log(response);
    setDepositLoading(false);
  }, []);

  return (
    <div className="container-fluid px-0 px-sm-4 mb-4">
      <h2 className="mb-4">{t('deposit_page_title')}</h2>
      <AmountContainer
        title={t('total_playable_amount')}
        amount={user.balance!}
        tooltip={t('playable_amount_tooltip')}
      />
      {!!bankResponse && (
        <div className="amount-container mb-4">
          <h2 className="amount-container__amount">
            {bankResponse.toUpperCase()} deposit
          </h2>
        </div>
      )}
      <InputContainer
        title={t('select_amount')}
        placeholder="€ 300"
        buttonText={t('deposit_btn')}
        loading={depositLoading}
        onSubmit={handleRequestDeposit}
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
    </div>
  );
};

export default DepositPage;
