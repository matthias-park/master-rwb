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

export interface UserStatus {
  loading: boolean;
  logout?: true;
  logged_in: boolean;
  token?: string;
  id?: number;
  name?: string;
  balance?: string;
  currency?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  bank_account?: boolean;
}

export default UserStatus;
