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
  FirstDepositNotFromMainAccount = -5,
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
  ConfirmedMismatch = 6,
  PendingMismatch = 7,
  RejectedMismatch = 8,
  ConfirmedAndReconciled = 9,
  RejectedAndReconciled = 10,
}

export enum UnverifiedDepositReason {
  Forced = 0,
  NameMismatch = 1,
  DepositDisallowed = 2,
  NumberOfWalletsExceeded = 3,
  RuleEngine = 4,
  FirstDepositNotFromMainAccount = 5,
  AccountAlreadyInUse = 20,
}

export interface DepositStatusData {
  Code: number;
  DepositStatus: number;
  Message: string;
  UnverifiedDepositReason: number;
}

export interface DepositRequest {
  [key: string]: number | string | boolean | null | undefined;
  BankId: number;
  Amount: number;
  ReturnSuccessUrl: string;
  ReturnPendingUrl?: string;
  AccountId?: number | null;
  Prefill?: boolean;
}

export default DepositResponse;
