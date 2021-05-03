export interface NET_USER {
  PlayerId: number;
  Login: string;
  Email: string;
  Balance: number;
  CurrencyId: number;
  Code: number;
  Message: string;
  error?: string;
}

export enum VALIDATOR_STATUS {
  OK = 0,
  SMALL_ERROR = 1,
  MINOR_ERROR = 2,
  MAJOR_ERROR = 3,
  NONE = 4,
}

export interface UserStatus {
  loading: boolean;
  logout?: true;
  logged_in: boolean;
  login_click?: boolean;
  token?: string;
  id?: number;
  name?: string;
  balance?: string;
  currency?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  validator_status?: VALIDATOR_STATUS;
  barcode?: string;
  max_deposit?: number | null;
}

export interface UserBankAccount {
  bank_account: boolean;
}

export default UserStatus;
