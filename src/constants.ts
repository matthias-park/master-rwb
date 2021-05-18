import RailsApiResponse from './types/api/RailsApiResponse';

export const TestEnv = process.env.TARGET_ENV === 'test';
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
  ResponsibleGamblingModal,
  ValidationFailedModal,
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
  LocaleSelectPage = 20,
  PersonalInfoPage = 21,
  CommunicationPreferencesPage = 22,
  ChangePasswordPage = 23,
  CloseAccountPage = 24,
  ResponsibleGamingPage = 25,
  LoginPage = 26,
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

export const ALL_LOCALES = [
  'cy-az-az',
  'cy-sr-sp',
  'cy-uz-uz',
  'lt-az-az',
  'lt-sr-sp',
  'lt-uz-uz',
  'aa',
  'ab',
  'ae',
  'af',
  'af-za',
  'ak',
  'am',
  'an',
  'ar',
  'ar-ae',
  'ar-bh',
  'ar-dz',
  'ar-eg',
  'ar-iq',
  'ar-jo',
  'ar-kw',
  'ar-lb',
  'ar-ly',
  'ar-ma',
  'ar-om',
  'ar-qa',
  'ar-sa',
  'ar-sy',
  'ar-tn',
  'ar-ye',
  'as',
  'av',
  'ay',
  'az',
  'ba',
  'be',
  'be-by',
  'bg',
  'bg-bg',
  'bh',
  'bi',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'ca-es',
  'ce',
  'ch',
  'co',
  'cr',
  'cs',
  'cs-cz',
  'cu',
  'cv',
  'cy',
  'da',
  'da-dk',
  'de',
  'de-at',
  'de-ch',
  'de-de',
  'de-li',
  'de-lu',
  'div-mv',
  'dv',
  'dz',
  'ee',
  'el',
  'el-gr',
  'en',
  'en-au',
  'en-bz',
  'en-ca',
  'en-cb',
  'en-gb',
  'en-ie',
  'en-jm',
  'en-nz',
  'en-ph',
  'en-tt',
  'en-us',
  'en-za',
  'en-zw',
  'eo',
  'es',
  'es-ar',
  'es-bo',
  'es-cl',
  'es-co',
  'es-cr',
  'es-do',
  'es-ec',
  'es-es',
  'es-gt',
  'es-hn',
  'es-mx',
  'es-ni',
  'es-pa',
  'es-pe',
  'es-pr',
  'es-py',
  'es-sv',
  'es-uy',
  'es-ve',
  'et',
  'et-ee',
  'eu',
  'eu-es',
  'fa',
  'fa-ir',
  'ff',
  'fi',
  'fi-fi',
  'fj',
  'fo',
  'fo-fo',
  'fr',
  'fr-be',
  'fr-ca',
  'fr-ch',
  'fr-fr',
  'fr-lu',
  'fr-mc',
  'fy',
  'ga',
  'gd',
  'gl',
  'gl-es',
  'gn',
  'gu',
  'gu-in',
  'gv',
  'ha',
  'he',
  'he-il',
  'hi',
  'hi-in',
  'ho',
  'hr',
  'hr-hr',
  'ht',
  'hu',
  'hu-hu',
  'hy',
  'hy-am',
  'hz',
  'ia',
  'id',
  'id-id',
  'ie',
  'ig',
  'ii',
  'ik',
  'io',
  'is',
  'is-is',
  'it',
  'it-ch',
  'it-it',
  'iu',
  'ja',
  'ja-jp',
  'jv',
  'ka',
  'ka-ge',
  'kg',
  'ki',
  'kj',
  'kk',
  'kk-kz',
  'kl',
  'km',
  'kn',
  'kn-in',
  'ko',
  'ko-kr',
  'kr',
  'ks',
  'ku',
  'kv',
  'kw',
  'ky',
  'ky-kz',
  'la',
  'lb',
  'lg',
  'li',
  'ln',
  'lo',
  'lt',
  'lt-lt',
  'lu',
  'lv',
  'lv-lv',
  'mg',
  'mh',
  'mi',
  'mk',
  'mk-mk',
  'ml',
  'mn',
  'mn-mn',
  'mr',
  'mr-in',
  'ms',
  'ms-bn',
  'ms-my',
  'mt',
  'my',
  'na',
  'nb',
  'nb-no',
  'nd',
  'ne',
  'ng',
  'nl',
  'nl-be',
  'nl-nl',
  'nn',
  'nn-no',
  'no',
  'nr',
  'nv',
  'ny',
  'oc',
  'oj',
  'om',
  'or',
  'os',
  'pa',
  'pa-in',
  'pi',
  'pl',
  'pl-pl',
  'ps',
  'pt',
  'pt-br',
  'pt-pt',
  'qu',
  'rm',
  'rn',
  'ro',
  'ro-ro',
  'ru',
  'ru-ru',
  'rw',
  'sa',
  'sa-in',
  'sc',
  'sd',
  'se',
  'sg',
  'si',
  'sk',
  'sk-sk',
  'sl',
  'sl-si',
  'sm',
  'sn',
  'so',
  'sq',
  'sq-al',
  'sr',
  'ss',
  'st',
  'su',
  'sv',
  'sv-fi',
  'sv-se',
  'sw',
  'sw-ke',
  'ta',
  'ta-in',
  'te',
  'te-in',
  'tg',
  'th',
  'th-th',
  'ti',
  'tk',
  'tl',
  'tn',
  'to',
  'tr',
  'tr-tr',
  'ts',
  'tt',
  'tt-ru',
  'tw',
  'ty',
  'ug',
  'uk',
  'uk-ua',
  'ur',
  'ur-pk',
  'uz',
  've',
  'vi',
  'vi-vn',
  'vo',
  'wa',
  'wo',
  'xh',
  'yi',
  'yo',
  'za',
  'zh',
  'zh-chs',
  'zh-cht',
  'zh-cn',
  'zh-hk',
  'zh-mo',
  'zh-sg',
  'zh-tw',
  'zu',
];

export const REGEX_EXPRESSION = {
  LETTERS_WITH_SEPERATORS: /^((?:[ '-]*)[\p{L}]+(?:[ '-]*))*$/iu,
  EMAIL: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
  PHONE_NUMBER_NORMALIZE: /\s|\.|\/|[(][0-9][)]?|^0+/g,
  PHONE_NUMBER: /^\+?[1-9]\d{1,14}$/,
  BANK_IBAN: /^(BE)[0-9]{2}([ ]?[0-9]{4}){3}$/g,
};

export const VALIDATIONS = {
  name: (value: string = '') =>
    (!!value.trim().length &&
      REGEX_EXPRESSION.LETTERS_WITH_SEPERATORS.test(value.trim())) ||
    value === '*',
  email: (value: string = '') => {
    const trimmedValue = value.trim();
    let valid =
      REGEX_EXPRESSION.EMAIL.test(trimmedValue) &&
      trimmedValue.split('@')?.[0]?.length < 65 &&
      trimmedValue.split('@')?.[1]?.length < 255;
    const lastDot = trimmedValue.lastIndexOf('.');
    if (trimmedValue.length - lastDot < 3) valid = false;
    return valid;
  },
  phone: (value: string = '') => {
    const phone = value
      .trim()
      .replace(REGEX_EXPRESSION.PHONE_NUMBER_NORMALIZE, '');
    return REGEX_EXPRESSION.PHONE_NUMBER.test(phone);
  },
  bank_account: (value: string = '') =>
    REGEX_EXPRESSION.BANK_IBAN.test(value.trim()),
  passwordMixOfThree: (value: string = '') => {
    if (value.includes(' ')) return false;
    const valueValid = value.length > 7;
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return (
      valueValid &&
      [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialCharacters].filter(
        Boolean,
      ).length > 2
    );
  },
};

export const PAGES_WITH_CAPTCHA_ICON = [
  PagesName.RegisterPage,
  PagesName.ContactUsPage,
  PagesName.ForgotPasswordPage,
];

export const CONTENT_PAGES = [
  PagesName.TemplatePage,
  PagesName.FaqPage,
  PagesName.ResponsibleGamingPage,
];
