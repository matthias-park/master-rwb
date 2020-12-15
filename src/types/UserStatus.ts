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
  logged_in: boolean;
  token: string;
  format: string;
  cc: string;
  errors?: any;
  test: boolean;
  registration_not_finished: boolean;
  nick: string;
  id: number;
  email: string;
  first_name: string;
  name: string;
  tv_streams: TvStreams;
  contract: Contract;
  deposit_contract: DepositContract;
  need_to_change_login: boolean;
  first_login: boolean;
  menu: Menu;
  features: Features;
  evtsrv: Evtsrv;
  balance: string;
}

export interface UserStatus {
  user: User;
  redirect?: any;
}

export default UserStatus;
