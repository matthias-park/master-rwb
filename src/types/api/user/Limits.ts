export interface LimitData {
  AmountLeft: number;
  Formatting: 'currency' | 'hour' | 'none';
  FutureLimitAmount: number;
  FutureLimitValidFrom: number;
  LimitAmount: number;
  LimitType: string;
  ResetTime: string;
  ValidTo: string;
}
