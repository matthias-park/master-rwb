import React, { useState } from 'react';
import styled from 'styled-components';
import SelectInput from '../../../../components/customFormInputs/SelectInput';
import LoadingButton from '../../../../components/LoadingButton';
import { useI18n } from '../../../../hooks/useI18n';
import BankDepositAccount from '../../../../types/api/deposits/account';

const StyledRow = styled.div`
  display: flex;
  .bank-accounts {
    width: 100%;
    padding-right: 1rem;
  }
`;
interface AccountListProps {
  accounts: BankDepositAccount[];
  registerName: string;
  registerRules?: any;
  selectedBankAccount?: number;
  deleteSelectedAccount: () => Promise<unknown>;
}
const PaymentAccountList = ({
  accounts,
  registerName,
  registerRules,
  deleteSelectedAccount,
  selectedBankAccount,
}: AccountListProps) => {
  const { t } = useI18n();
  const [deletingAcc, setDeletingAcc] = useState(false);
  if (!accounts.length) return null;
  return (
    <StyledRow>
      <SelectInput
        key={accounts.length}
        id={registerName}
        className="bank-accounts"
        values={[
          { value: '', text: t('no_bank_account_selected') },
          ...accounts.map(acc => {
            const expDate = acc.expiry_date ? `(${acc.expiry_date}) ` : '';
            return {
              value: acc.id,
              text: `${acc.account} ${acc.name} ${expDate}`,
            };
          }),
        ]}
        rules={registerRules}
      />
      <LoadingButton
        className="mt-0"
        loading={deletingAcc}
        disabled={!selectedBankAccount}
        onClick={async () => {
          setDeletingAcc(true);
          await deleteSelectedAccount();
          setDeletingAcc(false);
        }}
      >
        {t('delete_bank_account')}
      </LoadingButton>
    </StyledRow>
  );
};
export default PaymentAccountList;
