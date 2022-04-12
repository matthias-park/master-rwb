interface BankDepositAccount {
  id: number;
  uniq_id: string;
  bank_id: number;
  bank_name: string;
  account: string;
  bank_account: null;
  name: string;
  net_balance: number;
  allow_edit_account: boolean;
  allow_sepa_payout: boolean;
  expiry_date: null;
  bank_icon?: string;
}

export default BankDepositAccount;
