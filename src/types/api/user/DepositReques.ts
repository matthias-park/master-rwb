interface DepositRequest {
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

export default DepositRequest;
