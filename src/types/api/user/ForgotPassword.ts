interface ForgotPasswordResponse {
  errors: { [key: string]: string[] };
  message: string;
  status: 'success' | 'failure' | 'timeout';
  title: string;
}

export default ForgotPasswordResponse;
