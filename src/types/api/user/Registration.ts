export interface PostRegistration {
  email: string;
  login: string;
  password: string;
  gender: string;
  street: string;
  postal_code: string;
  city: string;
  date_of_birth: string;
}
export interface ValidateRegisterInput {
  Exists: boolean;
  Success: boolean;
  Code: number;
  Message: string;
}
