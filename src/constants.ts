import RailsApiResponse from './types/api/RailsApiResponse';
import { FranchiseNames } from './types/FranchiseNames';
export const ProdEnv = process.env.TARGET_ENV === 'production';
export const DevEnv = process.env.TARGET_ENV === 'development';
export const TestEnv = process.env.TARGET_ENV === 'test';
export enum ComponentName {
  Header,
  Footer,
  LeftSidebar,
  RightSidebar,
  LoginDropdown,
  RequiredDocuments,
  MarketingSettings,
  BettingLossLimits,
  DepositLimit,
  SetTheWageringAmountLimitPerPeriod,
  SetTheWageringAmountLimitPerSession,
  DisablingYourAccount,
  Null,
  AddBankAccountModal = 'addBankAccountModal',
  ResponsibleGamblingModal = 'responsibleGamblingModal',
  ValidationFailedModal = 'validationFailedModal',
  TermsAndConditionsModal = 'termsAndConditionsModal',
  RegisterModal = 'registerModal',
  LoginModal = 'loginModal',
  CookiesModal = 'cookiesModal',
  GeoComplyModal = 'geoComplyModal',
  PlayerDisabledModal = 'playerDisabledModal',
  ForgotPasswordModal = 'forgotPasswordModal',
  ResetPasswordModal = 'resetPasswordModal',
  LimitsModal = 'limitsModal',
  ResendEmailModal = 'resendEmailModal',
  MaxBalanceModal = 'maxBalanceModal',
  QuickDepositModal = 'quickDepositModal',
  BettingHistory = 'bettingHistory',
  DepositLinkModal = 'depositLinkModal',
  ActivateUserModal = 'activateUserModal',
  CasinoGameInfoModal = 'casinoGameInfoModal',
  W9WinningsModal = 'w9WinningsModal',
  PageBackdrop = 'pageBackdrop',
  PromoClaimModal = 'promoClaimModal',
  DepositThresholdModal = 'depositThresholdModal',
  QuestionsKBAModal = 'questionKBAModal',
  LimitsReaffirmationModal = 'limitsReaffirmationModal',
  SessionReminderModal = 'sessionReminderModal',
}

export const ModalPriority = {
  [ComponentName.DepositThresholdModal]: 1,
  [ComponentName.TermsAndConditionsModal]: 1,
  [ComponentName.W9WinningsModal]: 3,
  [ComponentName.ValidationFailedModal]: 2,
  [ComponentName.ResponsibleGamblingModal]: 5,
  [ComponentName.ResendEmailModal]: 1,
  [ComponentName.ActivateUserModal]: 2,
  [ComponentName.PageBackdrop]: -100,
};

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
  TermsAndConditionsPage = 27,
  SportsPlayRetailPage = 28,
  RequiredDocuments = 29,
  WelcomePage = 30,
  CasinoPage = 31,
  CasinoInnerPage = 32,
  PromotionsInnerPage = 33,
  CasinoCategoryPage = 34,
  GameRoundsPage = 35,
  VerifyAccountPage = 36,
  RewardsDashboardPage = 37,
  RedeemRewardsPage = 38,
  InfoAffiliatePage = 39,
  InfoPaymentPage = 40,
  LiveSportsPage = 41,
  LiveCasinoPage = 42,
  TaxPage = 43,
  CasinoGameInfoPage = 44,
  BonusesPage = 45,
  RegisterActivationPage = 47,
  CasinoBetsPage = 48,
  TransactionsSummaryPage = 49,
  BettingShopsPage = 46,
  BettingShopInnerPage = 47,
  ChalklinePage = 49,
  BspotPackagesPage = 50,
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

export const REDIRECT_PROTECTED_NOT_LOGGED_IN = PagesName.LoginPage;

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

export const Config = window.__config__;
export const Franchise = {
  bnl: Config.name === FranchiseNames.Bnl,
  strive: Config.name === FranchiseNames.Strive,
  desertDiamond: Config.name === FranchiseNames.DesertDiamond,
  xCasino: Config.name === FranchiseNames.Xcasino,
  gnogaz: Config.name === FranchiseNames.Gnogaz,
  gnogon: Config.name === FranchiseNames.Gnogon,
  xCasinoCom: Config.name === FranchiseNames.XcasinoCom,
  mothership: Config.name === FranchiseNames.Mothership,
};

export const usaOnlyBrand = [
  FranchiseNames.Strive,
  FranchiseNames.Gnogaz,
  FranchiseNames.DesertDiamond,
].includes(Config.name);

export const REGEX_EXPRESSION = {
  LETTERS_WITH_SEPERATORS: /^((?:[ '-]*)[\p{L}]+(?:[ '-]*))*$/iu,
  EMAIL: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
  PHONE_NUMBER_NORMALIZE: /\s|\.|\/|[(][0-9][)]?|^0+/g,
  BANK_IBAN: /^(BE)[0-9]{2}([ ]?[0-9]{4}){3}$/g,
  PHONE_NUMBER: usaOnlyBrand ? /^\+?[1-9]\d{9,10}$/ : /^\+?[1-9]\d{1,14}$/,
  PO_BOX_ADDRESS: /\b(?:p\.?\s*o\.?|post\s+office)(\s+)?(?:box|[0-9]*)?\b/i,
  CITY: /^[0-z\u0080-\u024F '.-]{2,}$/,
  USA_POST_CODE: /^\d{5}/,
};

export const VALIDATIONS = {
  usa_post_code: value => REGEX_EXPRESSION.USA_POST_CODE.test(value),
  city: value => REGEX_EXPRESSION.CITY.test(value.trim()),
  exactLengh: ({
    value,
    exactLength,
  }: {
    value: string;
    exactLength: number;
  }) => {
    return value.trim().length === exactLength;
  },
  lengthLimitation: (value, min, max) =>
    value.length > min && value.length < max,
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
  password: (
    value: string = '',
    requiredValidations: RequiredValidations = {
      needsLength: 7,
      needsLowerCase: true,
      needsUpperase: true,
      needsNumbers: true,
      needsSpecialCharacters: false,
      needsEmail: false,
    },
    email: string = '',
  ): boolean => {
    const {
      needsLength,
      needsLowerCase,
      needsUpperase,
      needsNumbers,
      needsSpecialCharacters,
      needsEmail,
    } = requiredValidations || ComponentSettings?.register?.requiredValidations;
    if (value.includes(' ') || value.length <= needsLength) return false;
    //ADG Validation does not allow first three characters of an email in a password.
    const adgPasswordValidation = (): boolean => {
      if (needsEmail && !!email) {
        // !!email fixes the case where a player enters their password before email in registration
        return (
          email.length > 0 &&
          email.toString().toLowerCase().slice(0, 3) !==
            value.toString().toLowerCase().slice(0, 3)
        );
      } else {
        return true;
      }
    };
    const hasLowerCase = !needsLowerCase || /[a-z]/.test(value);
    const hasUpperCase = !needsUpperase || /[A-Z]/.test(value);
    const hasNumbers = !needsNumbers || /\d/.test(value);
    const hasSpecialCharacters =
      !needsSpecialCharacters || /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasEmail = !needsEmail || adgPasswordValidation();
    return (
      hasLowerCase &&
      hasUpperCase &&
      hasNumbers &&
      hasSpecialCharacters &&
      hasEmail
    );
  },
  validDateFormat: (dayjs: any, value: string = '') => {
    if (!value || !dayjs) return false;
    const dayJsObj = dayjs(value, franchiseDateFormat, true);
    if (!dayJsObj.isValid()) return false;
    if (dayjs().diff(dayJsObj, 'year') > 150) return false;
    return true;
  },
  over_21: (dayjs: any, value: string = '') => {
    if (!value) return false;
    const age = dayjs(value, franchiseDateFormat).add(21, 'year');
    return dayjs().isAfter(age);
  },
  overApprovedAge: (
    dayjs: any,
    value: string = '',
    approvedAge: number = 21,
  ) => {
    if (!value) return false;
    const age = dayjs(value, franchiseDateFormat).add(approvedAge, 'year');
    return dayjs().isAfter(age);
  },

  isAlpha: value => /^[a-zA-Z]*$/.test(value),
  isNotPoBox: (value: string = '') =>
    !REGEX_EXPRESSION.PO_BOX_ADDRESS.test(value),
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
export const franchiseDateFormat = Config.dateFormat || 'YYYY-MM-DD';
export const ComponentSettings = Config.componentSettings;
export const ThemeSettings = Config.themeSettings;

export enum CustomWindowEvents {
  ResetIdleTimer = 'resetIdleTimer',
  DepositPaymentSuccess = 'payment_success',
  DepositPaymentError = 'payment_error',
  DepositRequestReturn = 'deposit_request_return',
  DepositVerifyPayment = 'verify_payment_action',
  DepositPaymentWarning = 'payment_warning',
}

export enum LocalStorageKeys {
  locale = 'userLocale',
  cookies = 'cookiesSettings',
  sessionStart = 'sessionStart',
  sessionAcceptanceCounter = 'reminderAcceptanceCount',
  gameSessionTimer = 'gameSessionTimer',
}

interface RequiredValidations {
  needsLength: number;
  needsLowerCase: boolean;
  needsUpperase: boolean;
  needsNumbers: boolean;
  needsSpecialCharacters: boolean;
  needsEmail: boolean;
}
