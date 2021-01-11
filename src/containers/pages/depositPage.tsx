import React from 'react';
// import useSWR from 'swr';
// import { getApi } from '../../utils/apiUtils';
import { DEPOSIT_LIST } from '../../constants';
import DepositListItem from '../../types/DepositListItem';
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
  }
];

const DepositPage = () => {
  // const { data } = useSWR('/api/deposit-list', getApi);
  const data: DepositListItem[] = DEPOSIT_LIST;
  return (
    <div className="container-fluid px-0 px-sm-4 mb-4">
      <h2 className="mb-4">Deposit</h2>
      <AmountContainer title="Total playable amount" amount={80.10}/>
      <InputContainer title="Select Amount" placeholder="€ 300" buttonText="Deposit"/>
      <div className="info-container mb-4">
        <p className="info-container__info text-14 mb-0">
          To deposit through bank please deposit to this account
        </p>
        <div className="info-container__text">
          <ul className="list-unstyled mb-0"> 
            <li className="mb-1">IBAN: <span className="font-weight-bold">456654</span></li>
            <li className="mb-1">Bank Account: <span className="font-weight-bold">XX 7897 7894 1233 4566</span></li>
            <li className="mb-1">Bank Code: <span className="font-weight-bold">XXCVI45789</span></li>
            <li className="mb-1">Bank: <span className="font-weight-bold">National Bank</span></li>
          </ul>
        </div>
      </div>
      <QuestionsContainer items={questionItems}/>
    </div>
  );
};

export default DepositPage;
