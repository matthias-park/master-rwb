import { BankAccount } from './api/user/Withdrawal';

export interface NET_USER {
  PlayerId: number;
  Login: string;
  Email: string;
  Balance: number;
  CurrencyId: number;
  Code: number;
  Message: string;
  error?: string;
  currency?: string;
}
export interface TwoFactorAuth {
  authentication_required: boolean;
}

export enum VALIDATOR_STATUS {
  OK = 0,
  SMALL_ERROR = 1,
  MINOR_ERROR = 2,
  MAJOR_ERROR = 3,
  NONE = 4,
}

export interface UserStatus {
  needsSync?: boolean;
  loading: boolean;
  logout?: boolean;
  logged_in: boolean;
  login_click?: boolean;
  token?: string;
  id?: number;
  name?: string;
  balance?: number;
  currency?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  validator_status?: VALIDATOR_STATUS;
  player_timeout?: { DisableReason: number; DisableUntil: Date };
  barcode?: string;
  tnc_required?: boolean;
  authentication_enabled?: boolean;
}

export interface UserBankAccount {
  bank_account: boolean;
}

export default UserStatus;
