export interface JSONFormPage {
  id: string;
  title: string;
  action: string;
  form: Form[];
}

export interface Form {
  id: string;
  title: string;
  type: string;
  default?: string | Value | null;
  style?: string;
  required?: boolean;
  values?: Value[];
  dateFrom?: number;
  dateTo?: number;
  disabled?: boolean;
}

export interface Value {
  id: number;
  title: string;
}
