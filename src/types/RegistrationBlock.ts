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
    | 'postal_code';
  required?: boolean;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
  triggerId?: string;
  autoComplete?: string | undefined;
  inputFormatting?: {
    format?: string | ((value: string) => string);
    allowEmptyFormatting?: boolean;
    mask?: string;
  };
  disableCopyPaste?: boolean;
}

export interface OnlineFormBlock {
  title?: string;
  description?: string;
  fields: OnlineFormBlockField[];
}
