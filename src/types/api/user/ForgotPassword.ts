interface ForgotPasswordResponse {
  Code: number;
  FirstName: string;
  Login: string;
  Message: string;
  ResetCode: string;
  SendEmail: boolean;
  Success: boolean;
}

export default ForgotPasswordResponse;
