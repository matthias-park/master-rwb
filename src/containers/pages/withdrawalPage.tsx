import React from 'react';
// import useSWR from 'swr';
// import { getApi } from '../../utils/apiUtils';
import AmountContainer from 'components/account-settings/AmountContainer';
import InputContainer from 'components/account-settings/InputContainer';
import QuestionsContainer from 'components/account-settings/QuestionsContainer';

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

const WithdrawalPage = () => {
  return (
    <div className="container-fluid px-0 px-sm-4 mb-4">
      <h2 className="mb-4">Withdrawal</h2>
      <AmountContainer title="Total playable amount" amount={80.1} />
      <InputContainer
        title="How much do you want to withdraw?"
        placeholder="€ 300"
        buttonText="Withdrawal Request"
        onSubmit={() => {}}
      />
      <div className="info-container mb-4">
        <p className="info-container__info pb-0 mb-n1">
          <strong>Your bank account number</strong>
        </p>
        <p className="info-container__info text-14 mb-0">
          This limit determines the maximum amount that you can deposit into
          your gaming account within 7 days. You can set a higher or lower limit
          yourself.
        </p>
        <div className="info-container__text">
          <ul className="list-unstyled mb-0">
            <li className="mb-1">Your current bank account number:</li>
            <li className="mb-1">BE12 **** **** 1234</li>
          </ul>
        </div>
      </div>
      <QuestionsContainer items={questionItems} />
    </div>
  );
};

export default WithdrawalPage;
