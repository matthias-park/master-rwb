export interface PostRegistration {
  email: string;
  login: string;
  password: string;
  gender: string;
  street: string;
  postal_code: string;
  city: string;
  date_of_birth: string;
  language_id: string;
}
export interface ValidateRegisterInput {
  Exists: boolean;
  Success: boolean;
  Code: number;
  Message: string;
}

export interface ValidateRegisterPersonalCode {
  Success: boolean;
  Code: number;
  Message: string | null;
  Data:
    | {
        valid: true;
        result: {
          year: string;
          month: string;
          day: string;
          diff: string;
          checksum: string;
          gender: string;
        };
      }
    | string;
}

export interface RegistrationResponse {
  RegistrationId: number;
  Email: string;
  Login: string;
  PlayerId: number;
  Code: number;
  Message: string;
}
