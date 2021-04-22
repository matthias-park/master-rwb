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
    | 'email';
  required?: boolean;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
  triggerId?: string;
  autoComplete?: ((value: string) => Promise<any>) | string;
  labelKey?: (value: any) => string;
  inputFormatting?: {
    format?: string | ((value: string) => string);
    allowEmptyFormatting?: boolean;
    mask?: string;
  };
  disableCopyPaste?: boolean;
}

export interface OnlineFormBlock {
  title?: string;
  fields: OnlineFormBlockField[];
}
