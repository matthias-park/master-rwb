import RailsApiResponse from './types/api/RailsApiResponse';

export const TestEnv = process.env.NODE_ENV === 'test';
export enum ComponentName {
  Header,
  Footer,
  LoginDropdown,
  RequiredDocuments,
  MarketingSettings,
  BettingLossLimits,
  DepositLimit,
  SetTheWageringAmountLimitPerPeriod,
  SetTheWageringAmountLimitPerSession,
  DisablingYourAccount,
  AddBankAccountModal,
  Null,
  CookiesModal = 'cookiesModal',
}

export enum PagesName {
  HomePage = 1,
  FaqPage = 2,
  SportsPage = 3,
  RegisterPage = 4,
  PromotionsPage = 5,
  DepositPage = 6,
  LimitsPage = 7,
  SettingsPage = 8,
  WithdrawalPage = 9,
  TransactionsPage = 10,
  ForgotPasswordPage = 11,
  ResetPasswordPage = 12,
  ForgotLoginPage = 13,
  NotFoundPage = 14,
  TemplatePage = 15,
  ContactUsPage = 16,
  SitemapPage = 17,
  BettingRulesPage = 18,
  Null = 19,
}

export enum FormFieldValidation {
  Valid = 1,
  Invalid,
  Validating,
}

export const iconName: { [key: string]: string } = {
  mail: 'mail2',
  instagram: 'nsta',
};

export const REDIRECT_PROTECTED_NOT_LOGGED_IN = PagesName.HomePage;

export const RailsApiResponseFallback: RailsApiResponse<null> = {
  Code: -1,
  Data: null,
  Message: null,
  Success: false,
  Fallback: true,
};

export const KambiSbLocales = {
  nl: 'nl_BE',
  fr: 'fr_BE',
  de: 'de_DE',
};
