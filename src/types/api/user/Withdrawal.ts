export interface Withdrawal {
  title: string;
  translations?: { [key: string]: string };
  requests?: Request[];
  info: string;
  default_account?: BankAccount;
  accounts?: BankAccount[];
}

export interface BankAccount {
  uniq_id: string;
  bank: string;
  bank_id: number;
  account: string;
  name: string;
  min_withdraw_amount: number;
  max_withdraw_amount: number;
  editable: boolean;
  allow_sepa_payout: boolean;
  net_balance: number;
  icon?: string;
}

export interface Request {
  cancel_requested: boolean;
  id: number;
  bank: string;
  account: string;
  amount: string;
  name: string;
  is_used: boolean;
}

export interface RequestWithdrawalResponse {
  token: string;
  confirmation: WithdrawalConfirmation;
}

export interface WithdrawalConfirmation {
  title: string;
  action: string;
  message: string;
  type: string;
  ok: string;
  cancel: string;
  params: WithdrawalConfirmationParams;
  confirm_info: WithdrawalConfirmationConfirmData;
}
export interface WithdrawalConfirmationParams {
  amount: number;
  id: string;
  edited_account: string;
  confirm: number;
  withdrawal_type: number;
}
export interface WithdrawalConfirmationConfirmData {
  amount: string;
  fee: string;
  amount_with_fee: string;
  bank: string;
  account: string;
  name: string;
}
