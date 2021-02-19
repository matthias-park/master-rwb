export interface OnlineFormBlockField {
  id: string;
  value?: string;
  name?: string;
  type: 'radio' | 'password' | 'text' | 'date' | 'checkbox';
  required?: boolean;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
  triggerId?: string;
  autoComplete?: string;
}

export interface OnlineFormBlock {
  title?: string;
  fields: OnlineFormBlockField[];
}
