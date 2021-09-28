export interface DepositLimits {
  MaxDepositLimitType: string;
  MaxDepositLimitAmout: number;
  MaxDepositAmountLeft: number;
  MaxDepositResetTime: string;
  RequestLimitAmount: number | null;
  RequestLimitType: string;
  RequestLimitCreated: null;
  ActivationCode: null;
  RequestActionType: null;
  ValidTo: null;
  FutureLimitAmount: number | null;
  FutureLimitValidFrom: number | null;
  CoolingOffPeriodByHours: string;
}
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
  Errored = -4,
  Canceled = -3,
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
