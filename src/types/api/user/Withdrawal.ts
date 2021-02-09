export interface Withdrawal {
  token: string;
  title: string;
  action: string;
  translations: { [key: string]: string };
  requests?: Request[];
  info: string;
  info_data: InfoData;
  fields: Field[];
  note?: string;
  error?: string;
}

export interface Field {
  id: string;
  type: string;
  default?: number;
  values?: Value[];
  title?: string;
  errors?: any[];
  visible?: boolean;
  disabled?: boolean;
}

export interface Value {
  id: string;
  title: string;
  additional_fields: any[];
  image: string;
  set_values: SetValues;
}

export interface SetValues {
  min_withdraw: string;
  max_withdraw: string;
}

export interface InfoData {
  min_withdraw_amount: string;
  max_withdraw_amount: string;
  user_max_withdraw_amount: string;
  fee: string;
  days_interval_banks: null;
  days_interval_ebanks: null;
  fee_percentage: null;
  withdrawal_max_amount_weekly: string;
  withdrawal_max_amount_monthly: string;
}

export interface Request {
  cancel_requested: boolean;
  id: number;
  bank: string;
  account: string;
  amount: string;
  name: string;
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
