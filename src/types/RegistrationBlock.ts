import { CleaveOptions } from 'cleave.js/options';
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
  inputFormatting?: CleaveOptions;
}

export interface OnlineFormBlock {
  title?: string;
  fields: OnlineFormBlockField[];
}
