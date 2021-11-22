interface RequestReturn {
  AdditionalData: {
    redirectUrl?: string;
    verifyPaymentData?: any;
  } | null;
  Code: number;
  Error: string;
  ID: number;
  OK: boolean;
}

export default RequestReturn;
