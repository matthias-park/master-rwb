export interface PostRegistration {
  email: string;
  login: string;
  password: string;
  gender: string;
  address: string;
  postal_code: string;
  city: string;
  date_of_birth: string | null;
  language_id?: number;
  captcha_token?: string;
  firstname?: string;
  lastname?: string;
  datepicker_year?: string;
  datepicker_month?: string;
  datepicker_day?: string;
  btag?: string;
}
export interface ValidateRegisterInput {
  Exists: boolean;
  Success: boolean;
  Code: number;
  Message: string;
}

export interface ValidateRegisterPersonalCode {
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

export interface PostCodeInfo {
  district_name: string;
  locality: string;
  locality_name: string;
  locality_type: string;
  zip_code: string;
}

export interface RegistrationPostalCodeAutofill {
  valid: boolean;
  result: PostCodeInfo[];
}
