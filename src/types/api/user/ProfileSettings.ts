interface ProfileSettings {
  token: string;
  forms: SettingsForm[];
}

export default ProfileSettings;

export interface SettingsForm {
  open?: boolean;
  id: string;
  title: string;
  note: string;
  footer?: string;
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
  date?: string;
  status?: string[];
  style?: SettingsFieldStyle;
  default?: number | null | string;
  enabled?: boolean;
  values?: SettingsFieldValue[];
  visible?: boolean;
  disabled?: boolean;
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
