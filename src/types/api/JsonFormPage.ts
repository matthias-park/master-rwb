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
  default?: Default[];
  style?: string;
  required?: boolean;
}

export interface Default {
  id: number;
  title: string;
}
