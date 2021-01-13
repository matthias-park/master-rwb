import React, { useCallback } from 'react';
import AmountContainer from 'components/account-settings/AmountContainer';
import InputContainer from 'components/account-settings/InputContainer';
import QuestionsContainer from 'components/account-settings/QuestionsContainer';
import { getApi, postApi } from '../../utils/apiUtils';
import { useParams } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import DepositRequest from '../../types/api/user/DepositReques';

const questionItems = [
  {
    title: 'Additional Information',
    body: 'Expanded description block',
  },
  {
    title: 'Additional Information',
    body: 'Expanded description block',
  },
];

const handleRequestDeposit = async (depositValue: number) => {
  const userIp: any = await getApi('/check-cf-ip');
  const response: DepositRequest | null = await postApi(
    `/tgbetapi/franchises/38/players/_player_id_/deposit_request`,
    {
      tgbet_params: JSON.stringify({
        BankId: 160,
        ip: userIp?.ip || '0.0.0.0',
        amount: depositValue,
        ReturnSuccessUrl: `${window.location.href}/success`,
        ReturnCancelUrl: `${window.location.href}/cancel`,
        ReturnErrorUrl: `${window.location.href}/error`,
      }),
    },
  );
  if (response?.Success) {
    window.location.href = response.RedirectUrl;
  }
};

const DepositPage = () => {
  let { bankResponse } = useParams<{ bankResponse?: string }>();
  return (
    <div className="container-fluid px-0 px-sm-4 mb-4">
      <h2 className="mb-4">Deposit</h2>
      <AmountContainer title="Total playable amount" amount={80.1} />
      {bankResponse === 'success' && (
        <div className="amount-container mb-4">
          <h2 className="amount-container__amount">Successfull deposit</h2>
        </div>
      )}
      {bankResponse === 'error' && (
        <div className="amount-container mb-4">
          <h2 className="amount-container__amount">ERROR deposit</h2>
        </div>
      )}
      {bankResponse === 'cancel' && (
        <div className="amount-container mb-4">
          <h2 className="amount-container__amount">CANCEL deposit</h2>
        </div>
      )}
      <InputContainer
        title="Select Amount"
        placeholder="€ 300"
        buttonText="Deposit"
        onSubmit={handleRequestDeposit}
      />
      <div className="info-container mb-4">
        <p className="info-container__info text-14 mb-0">
          To deposit through bank please deposit to this account
        </p>
        <div className="info-container__text">
          <ul className="list-unstyled mb-0">
            <li className="mb-1">
              IBAN: <span className="font-weight-bold">456654</span>
            </li>
            <li className="mb-1">
              Bank Account:{' '}
              <span className="font-weight-bold">XX 7897 7894 1233 4566</span>
            </li>
            <li className="mb-1">
              Bank Code: <span className="font-weight-bold">XXCVI45789</span>
            </li>
            <li className="mb-1">
              Bank: <span className="font-weight-bold">National Bank</span>
            </li>
          </ul>
        </div>
      </div>
      <QuestionsContainer items={questionItems} />
    </div>
  );
};

export default DepositPage;
