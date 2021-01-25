interface ProfileSettings {
  token: string;
  status: null;
  profile_info: ProfileInfo;
  forms: SettingsForm[];
}

export default ProfileSettings;

export interface SettingsForm {
  open?: boolean;
  id: string;
  title: string;
  note: string;
  action: string;
  errors: any[];
  prefix?: string;
  fields: SettingsField[];
  additonal_note?: string;
}

export interface SettingsField {
  id: string;
  type: string;
  text?: string;
  title?: string;
  errors?: any[];
  status?: string[];
  style?: SettingsFieldStyle;
  default?: number | null | string;
  enabled?: boolean;
  values?: SettingsFieldValue[];
  visible?: boolean;
}

export enum SettingsFieldStyle {
  Form = 'form',
  Negative = 'negative',
  Positive = 'positive',
}

export interface SettingsFieldValue {
  title: string;
  id: number | string;
  additional_fields?: string[];
}

export interface ProfileInfo {
  last_login: LastLogin;
}

export interface LastLogin {
  title: string;
  value: string;
}

export interface UpdateSettingResponse {
  success?: boolean;
  status?: 'success' | 'failure';
  message?: string;
}
