export interface SelectValue {
  value: string | number;
  text: string;
  default?: boolean;
}
export interface OnlineFormBlockField {
  id: string;
  value?: string;
  name?: string;
  type:
    | 'radio'
    | 'password'
    | 'text'
    | 'date'
    | 'checkbox'
    | 'number'
    | 'email'
    | 'postal_code'
    | 'select'
    | 'smartyStreets';
  required?: boolean;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
  triggerId?: string;
  autoComplete?: string | undefined;
  inputFormatting?: {
    format?: string | ((value: string) => string);
    allowEmptyFormatting?: boolean;
    mask?: string | string[];
    useFormatted?: boolean;
  };
  disableCopyPaste?: boolean;
  valueAs?: (value: string) => unknown;
  selectValues?: (() => Promise<SelectValue[]>) | SelectValue[];
}

export interface OnlineFormBlock {
  title?: string;
  description?: string;
  fields: any;
}
