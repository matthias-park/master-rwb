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

export interface DepositRequest {
  BankId: number;
  Ip: string;
  Amount: number;
  ReturnSuccessUrl: string;
  ReturnCancelUrl: string;
  ReturnErrorUrl: string;
}

export default DepositResponse;
