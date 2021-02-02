import { ConfigRoute } from './types/Config';
import HeadData from './types/HeadData';
import HeaderLink from './types/HeaderLinks';

export const TestEnv = process.env.NODE_ENV === 'test';
export enum ComponentName {
  Header,
  Footer,
  LoginDropdown,
  HomePage,
  CookiePolicyPage,
  FaqPage,
  SportsPage,
  RegisterPage,
  PromotionsPage,
  BonusPage,
  DepositPage,
  LimitsPage,
  SettingsPage,
  WithdrawalPage,
  TransactionsPage,
  ForgotPasswordPage,
  RequiredDocuments,
  MarketingSettings,
  BettingLossLimits,
  DepositLimit,
  SetTheWageringAmountLimitPerPeriod,
  SetTheWageringAmountLimitPerSession,
  DisablingYourAccount,
  NotFoundPage,
}

export enum FormFieldValidation {
  Valid,
  Invalid,
  Validating,
}

export const HEADER_ROUTES: HeaderLink[] = [
  {
    name: 'nav_link_sports',
    path: '/sports',
    order: 1,
    links: [
      {
        text: 'Action',
        path: '#',
        order: 1,
      },
      {
        text: 'Another action',
        path: '#',
        order: 2,
      },
      {
        text: 'Something else here',
        path: '#',
        order: 3,
      },
    ],
    bottomButton: {
      name: 'Alle resultaten',
      path: '#',
    },
  },
  {
    name: 'Winnaars',
    order: 2,
    links: [
      {
        text: 'Action',
        path: '#',
        order: 1,
      },
      {
        text: 'Another action',
        path: '#',
        order: 2,
      },
      {
        text: 'Something else here',
        path: '#',
        order: 3,
      },
    ],
    bottomButton: {
      name: 'Alle resultaten',
      path: '#',
    },
  },
  {
    name: 'Meer dan spelen',
    path: '#',
    order: 3,
  },
  {
    name: 'Voordelen en acties',
    path: '#',
    order: 4,
    links: [
      {
        text: 'Action',
        path: '#',
        order: 1,
      },
      {
        text: 'Another action',
        path: '#',
        order: 2,
      },
      {
        text: 'Something else here',
        path: '#',
        order: 3,
      },
    ],
  },
  {
    name: 'Loterij spelen',
    path: '#',
    order: 5,
    links: [
      {
        text: 'Action',
        path: '#',
        order: 1,
      },
      {
        text: 'Another action',
        path: '#',
        order: 2,
      },
      {
        text: 'Something else here',
        path: '#',
        order: 3,
      },
    ],
  },
];

export const TRANSLATION_SYMBOLS = [
  'link_sports',
  'live_betting',
  'promotions',
  'deposit',
  'bonus',
  'withdrawal',
  'profile',
  'logout',
  'login',
  'play_now',
  'login_email',
  'login_password',
  'login_remember_me',
  'login_forgot_password',
  'login_dont_have_lottery_acc',
  'login_register_with_card',
  'login_dont_have_acc',
  'login_registration_link',
  'login_find_out_lottery',
  'time_spent_in_website',
  'minimum_age_disclaimer',
  'footer_social_title',
  'footer_download_the_app',
  'find_us_in_social',
  '_date',
  'action',
  'account',
  'amount',
  'transactions_no_data',
  'days',
  'search',
  'deposit_page_title',
  'total_playable_amount',
  'playable_amount_tooltip',
  'select_amount',
  'deposit_btn',
  'deposit_to_bank_info',
  'deposit_iban',
  'deposit_bank_account',
  'deposit_bank_code',
  'deposit_bank_title',
  'deposit_bank_iban_data',
  'deposit_bank_account_data',
  'deposit_bank_code_data',
  'deposit_bank_title_data',
  'deposit_question_1',
  'deposit_answer_1',
  'deposit_question_2',
  'deposit_answer_2',
  'user_questions',
  'user_all_faq',
  'withdrawal_page_title',
  'withdrawal_amount',
  'withdrawal_btn',
  'withdrawal_question_1',
  'withdrawal_answer_1',
  'withdrawal_question_2',
  'withdrawal_answer_2',
  'transactions_page_title',
  'deposit_link',
  'bonus_link',
  'limits_link',
  'limits_link',
  'settings_link',
  'withdrawal_link',
  'transactions_link',
  'user_help_title',
  'help_call_us_number',
  'help_call_us_number_data',
  'help_call_days',
  'help_call_hours',
  'help_call_days_2',
  'help_call_hours_2',
  'help_check_faq',
  'help_mail_title',
  'help_mail_description',
  'footer_help',
  'faq_link',
  'contact_link',
  'footer_privacy',
  'privacy_policy_link',
  'preferences_link',
  'footer_how_where_play',
  'find_store_link',
  'play_online_link',
  'subscriptions_link',
  'play_responsibly_link',
  'all_possibilities_link',
  'footer_more_playing',
  'about_us_link',
  'mission_assignment_link',
  'charities_link',
  'grants_sponsorships_link',
  'services_link',
  'jobs_link',
  'press_link',
  'all_over_play_link',
  'sub_footer_title',
  'terms_conditions_link',
  'terms_use_link',
  'cookie_policy_link',
  'certs_code_conduct_link',
  'sitemap_link',
  'login_btn',
  'settings_file_upload',
  'settings_page_title',
  'settings_yes',
  'settings_no',
  'settings_page_failed_to_load',
  'register_title',
  'register_desc',
  'register_know_more',
  'register_persona_info',
  'register_input_login',
  'register_input_street',
  'register_input_postal_code',
  'register_input_city',
  'register_email_section',
  'register_input_email',
  'register_input_repeat_email',
  'register_password_section',
  'register_input_password',
  'register_input_repeat_password',
  'register_news_letter_desc',
  'register_privacy_btn',
  'register_accept_conditions',
  'register_terms_conditions',
  'register_submit_btn',
  'register_need_match_email',
  'register_need_match_password',
  'register_input_required',
  'register_already_taken',
  'register_input_personal_code',
  'register_password_weak',
  'register_email_bad_format',
  'register_personal_code_invalid',
  'nav_link_sports',
  'login_field_required',
  'login_invalid_credentials',
];

export const PROMOTION_LIST = [
  {
    link: 'welcome_onsite',
    img:
      'https://n.tonybet.com/uploads/1/post/image/5434/thumb_570_320_Sport_1.png',
    title: 'Sportsbook Welcome Offer',
  },
  {
    link: '/no-resolutions-casino-bonus',
    img:
      'https://n.tonybet.com/uploads/1/post/image/5447/thumb_570_320_570_x_320_Casino.png',
    title: 'Casino Welcome Offer',
  },
  {
    link: '/weekly-sports-cashback',
    img:
      'https://n.tonybet.com/uploads/1/post/image/6259/thumb_570_320_thumb_570_320_570x320_EN.png',
    title: 'Weekly Sports Cashback',
  },
  {
    link: '/no-resolutions-regulars-casino',
    img:
      'https://n.tonybet.com/uploads/1/post/image/5457/thumb_570_320_570_x_320_Casino_2.png',
    title: 'Casino Regulars Offer',
  },
  {
    link: '/drops-and-wins',
    img:
      'https://n.tonybet.com/uploads/1/post/image/6293/thumb_570_320_570x320__Without_Prize_Multiplier.jpg',
    title: 'Drops and Wins" Casino Campaign',
  },
];

export const HEAD_DATA: HeadData = {
  title: 'test header',
};

export const NAVIGATION_ROUTES: ConfigRoute[] = [
  {
    path: '/',
    id: ComponentName.HomePage,
  },
  {
    path: '/cookie-policy',
    id: ComponentName.CookiePolicyPage,
  },
  {
    path: '/faq',
    id: ComponentName.FaqPage,
  },
  {
    path: '/sports',
    id: ComponentName.SportsPage,
  },
  {
    path: '/register',
    id: ComponentName.RegisterPage,
  },
  {
    path: '/promotions',
    id: ComponentName.PromotionsPage,
  },
  {
    path: '/bonus',
    id: ComponentName.BonusPage,
    protected: true,
  },
  {
    path: '/deposit',
    id: ComponentName.DepositPage,
    protected: true,
  },
  {
    path: '/deposit/:bankResponse',
    id: ComponentName.DepositPage,
    protected: true,
  },
  {
    path: '/limits',
    id: ComponentName.LimitsPage,
    protected: true,
  },
  {
    path: '/settings',
    id: ComponentName.SettingsPage,
    protected: true,
  },
  {
    path: '/withdrawal',
    id: ComponentName.WithdrawalPage,
    protected: true,
  },
  {
    path: '/transactions',
    id: ComponentName.TransactionsPage,
    protected: true,
  },
  {
    path: '/forgot_password',
    id: ComponentName.ForgotPasswordPage,
  },
  {
    path: '*',
    id: ComponentName.NotFoundPage,
    exact: false,
  },
];

export const AVAILABLE_LOCALES = [
  {
    id: 6,
    iso: 'nl',
  },
  { id: 9, iso: 'de' },
  {
    id: 17,
    iso: 'fr',
  },
];

export const FOOTER_LINKS = [
  {
    order: 1,
    children: [
      {
        name: 'footer_help',
        order: 1,
        children: [
          {
            name: 'faq_link',
            link: '/faq',
            order: 1,
          },
          {
            name: 'contact_link',
            link: '/contact',
            order: 2,
          },
        ],
      },
      {
        name: 'footer_privacy',
        order: 2,
        children: [
          {
            name: 'privacy_policy_link',
            link: '/security-privacy',
            order: 1,
          },
          {
            name: 'preferences_link',
            link: '/preferences',
            order: 2,
          },
        ],
      },
    ],
  },
  {
    order: 2,
    children: [
      {
        name: 'footer_how_where_play',
        order: 1,
        children: [
          {
            name: 'find_store_link',
            link: '/find-store',
            order: 1,
          },
          {
            name: 'play_online_link',
            link: '/play-online',
            order: 2,
          },
          {
            name: 'subscriptions_link',
            link: '/subscriptions',
            order: 3,
          },
          {
            name: 'play_responsibly_link',
            link: '/play-responsibly',
            order: 4,
          },
          {
            name: 'all_possibilities_link',
            link: '/where-to-play',
            order: 5,
            button: true,
          },
        ],
      },
    ],
  },
  {
    order: 3,
    children: [
      {
        name: 'footer_more_playing',
        order: 1,
        children: [
          {
            name: 'about_us_link',
            link: '/about',
            order: 1,
          },
          {
            name: ' mission_assignment_link',
            link: '/mission',
            order: 2,
          },
          {
            name: 'charities_link',
            link: '/charities',
            order: 3,
          },
          {
            name: 'grants_sponsorships_link',
            link: '/sponsorships',
            order: 4,
          },
          {
            name: 'services_link',
            link: '/services',
            order: 5,
          },
          {
            name: 'jobs_link',
            link: '/jobs',
            order: 6,
          },
          {
            name: 'press_link',
            link: '/press',
            order: 7,
          },
          {
            name: 'all_over_play_link',
            link: '/play',
            order: 8,
            button: true,
          },
        ],
      },
    ],
  },
];
export const FOOTER_DATA = {
  social: {
    androidApp: '#',
    iosApp: '#',
    mail: '#',
    facebook: '#',
    youtube: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  },
  links: FOOTER_LINKS,
  subFooter: {
    title: 'sub_footer_title',
    links: [
      {
        name: 'terms_conditions_link',
        link: '/terms-and-conditions',
        order: 0,
      },
      {
        name: 'terms_use_link',
        link: '/terms-of-use',
        order: 1,
      },
      {
        name: 'cookie_policy_link',
        link: '/cookie-policy',
        order: 2,
      },
      {
        name: 'certs_code_conduct_link',
        link: '/certs-and-code-conduct',
        order: 3,
      },
      {
        name: 'sitemap_link',
        link: '/sitemap',
        order: 4,
      },
    ],
  },
};

export const iconName: { [key: string]: string } = {
  mail: 'mail2',
  instagram: 'nsta',
};

export const ACCOUNT_SETTINGS = [
  {
    name: 'Required documents',
    order: 1,
    component: ComponentName.RequiredDocuments,
  },
  {
    name: 'Marketing settings',
    order: 2,
    component: ComponentName.MarketingSettings,
  },
  {
    name: 'Betting Loss Limits',
    order: 3,
    component: ComponentName.BettingLossLimits,
  },
  {
    name: 'Deposit Limit',
    order: 4,
    component: ComponentName.DepositLimit,
  },
  {
    name: 'Set the wagering amount limit per period',
    order: 5,
    component: ComponentName.SetTheWageringAmountLimitPerPeriod,
  },
  {
    name: 'Set the wagering amount limit per session',
    order: 6,
    component: ComponentName.SetTheWageringAmountLimitPerSession,
  },
  {
    name: 'Disabling Your Account',
    order: 7,
    component: ComponentName.DisablingYourAccount,
  },
];

export const REDIRECT_PROTECTED_NOT_LOGGED_IN = ComponentName.HomePage;
