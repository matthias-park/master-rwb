export interface TvStreams {
  img: boolean;
  perform: boolean;
  unas: boolean;
}

export interface Contract {
  required: boolean;
  link?: any;
}

export interface DepositContract {
  required: boolean;
  link?: any;
}

export interface Menu {
  poker: boolean;
  livedealer: boolean;
  livegames: boolean;
  quickfire: boolean;
  promotions: boolean;
  stars_club: boolean;
  golden_race: boolean;
}

export interface Features {
  betslipv2: boolean;
  google_login: boolean;
  fb_login: boolean;
}

export interface Evtsrv {
  pre: string;
  live: string;
  ws: string;
  betslip: string;
}

export interface User {
  logout?: true;
  logged_in: boolean;
  token?: string;
  format?: string;
  id?: number;
  name?: string;
  balance?: string;
  loading: boolean;
  email?: string;
  first_name?: string;
  last_name?: string;
}

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
  user: User;
  redirect?: any;
}

export default UserStatus;
