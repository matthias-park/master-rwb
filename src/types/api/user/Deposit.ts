export interface DepositResponse {
  Code: number;
  DepositRequestId: number;
  InnerText: string | null;
  Message: string | null;
  PaymentResult: boolean;
  PaymentResultMessage: string | null;
  RedirectParams: null;
  RedirectUrl: string;
  Success: boolean;
}

export enum DepositStatus {
  Timeout = -2,
  None = -1,
  NotFound = 0,
  Pending = 1,
  Confirmed = 2,
  Rejected = 3,
  Return = 4,
  Unverified = 5,
}

export interface DepositRequest {
  [key: string]: number | string;
  BankId: number;
  Amount: number;
  ReturnSuccessUrl: string;
}

export default DepositResponse;
