import { ConfigRoute } from './types/Config';
import HeadData from './types/HeadData';
import HeaderLink from './types/HeaderLinks';
import RailsApiResponse from './types/api/RailsApiResponse';

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
  DepositPage,
  LimitsPage,
  SettingsPage,
  WithdrawalPage,
  TransactionsPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ForgotLoginPage,
  RequiredDocuments,
  MarketingSettings,
  BettingLossLimits,
  DepositLimit,
  SetTheWageringAmountLimitPerPeriod,
  SetTheWageringAmountLimitPerSession,
  DisablingYourAccount,
  NotFoundPage,
  TemplatePage,
  ContactUsPage,
  SitemapPage,
  CookiesModal,
  BettingRulesPage,
  Null,
}

export enum FormFieldValidation {
  Valid = 1,
  Invalid,
  Validating,
}

export const HEADER_ROUTES: HeaderLink[] = [
  {
    name: 'nav_link_sports',
    prefix: '/sports',
    order: 1,
    links: [
      {
        text: 'nav_link_sports_prematch',
        path: '/sports#home',
        order: 1,
      },
      {
        text: 'nav_link_sports_live',
        path: '/sports#filter/all/all/all/all/in-play',
        order: 2,
      },
      {
        text: 'nav_link_sports_bet_history',
        path: '/sports#bethistory',
        order: 3,
        onlyLoggedIn: true,
      },
      {
        text: 'nav_link_sports_promotions',
        path: '/sports#bethistory/rewards',
        order: 4,
        onlyLoggedIn: true,
      },
      {
        text: 'nav_link_sports_about_retails',
        path: '/sports/about_retails',
        order: 5,
      },
      {
        text: 'nav_link_sports_how_to_play',
        path: '/sports/how_to_play',
        order: 6,
      },
      {
        text: 'nav_link_sports_responsible_gaming',
        path: '/sports/responsible_gaming',
        order: 7,
      },
    ],
  },
  {
    name: 'nav_link_winners',
    prefix: '/winners',
    order: 2,
    links: [
      {
        text: 'nav_link_winners_winner_of_the_day',
        path: '/winners/winner_of_the_day',
        order: 1,
      },
      {
        text: 'nav_link_winners_how_to_win',
        path: '/winners/how_to_win',
        order: 2,
      },
    ],
  },
  {
    name: 'nav_link_more_than_playing',
    prefix: '/more_than_playing',
    order: 3,
    links: [
      {
        text: 'nav_link_more_than_playing_charities',
        path: '/more_than_playing/charities',
        order: 1,
      },
      {
        text: 'nav_link_more_than_playing_partners',
        path: '/more_than_playing/sport_partners',
        order: 2,
      },
    ],
  },
  {
    name: 'nav_link_promotions',
    prefix: '/promotions',
    order: 4,
    links: [
      {
        text: 'nav_link_promotions_promotions',
        path: '/promotions',
        order: 1,
      },
    ],
  },
  {
    name: 'nav_link_lottery',
    externalLink: true,
    order: 5,
    links: [
      {
        text: 'nav_link_lottery_lotto',
        path:
          'https://www.e-lotto.be/{__locale__}/drawGames/lotto/play/single/board',
        order: 1,
      },
      {
        text: 'nav_link_lottery_euromillions',
        path:
          'https://www.e-lotto.be/{__locale__}/drawGames/euromillions/play/single/board',
        order: 2,
      },
      {
        text: 'nav_link_lottery_win_for_life',
        path: 'https://www.e-lotto.be/{__locale__}/eGames/scratch',
        order: 3,
      },
      {
        text: 'nav_link_lottery_woohoo',
        path: 'https://www.e-lotto.be/{__locale__}/eGames/woohoo',
        order: 4,
      },
      {
        text: 'nav_link_lottery_all_games',
        path: 'https://www.e-lotto.be/{__locale__}/home',
        order: 5,
      },
    ],
  },
];

export const TRANSLATION_SYMBOLS = [
  'logout',
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
  'register_personal_info',
  'register_input_login',
  'register_input_street',
  'register_input_firstname',
  'register_input_lastname',
  'register_input_postal_code',
  'register_input_phone_number',
  'register_over_18',
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
  'register_input_newsletter',
  'register_input_terms_and_conditions',
  'register_input_postal_code_invalid',
  'register_page_submit_error',
  'nav_link_sports',
  'nav_link_winners',
  'nav_link_more_than_playing',
  'nav_link_promotions',
  'nav_link_lottery',
  'nav_link_sports_prematch',
  'nav_link_sports_live',
  'nav_link_sports_bet_history',
  'nav_link_lottery_lotto',
  'nav_link_lottery_euromillions',
  'nav_link_lottery_win_for_life',
  'nav_link_lottery_woohoo',
  'nav_link_lottery_all_games',
  'nav_link_winners_winner_of_the_day',
  'nav_link_winners_how_to_win',
  'nav_link_more_than_playing_charities',
  'nav_link_more_than_playing_partners',
  'nav_link_promotions_promotions',
  'nav_link_sports_promotions',
  'nav_link_sports_about_retails',
  'nav_link_sports_how_to_play',
  'nav_link_sports_responsible_gaming',
  'login_field_required',
  'promotions_page_title',
  'promotions_failed_to_load',
  'cookie_modal_title',
  'cookie_modal_text',
  'cookies_check_all',
  'cookies_check_essential',
  'cookies_check_functional',
  'cookies_check_thirdParty',
  'cookies_check_all_desc',
  'cookies_check_all_title',
  'cookies_check_all_short_desc',
  'cookies_check_essential_desc',
  'cookies_check_essential_title',
  'cookies_check_essential_short_desc',
  'cookies_check_functional_desc',
  'cookies_check_functional_title',
  'cookies_check_functional_short_desc',
  'cookies_check_thirdParty_desc',
  'cookies_check_thirdParty_title',
  'cookies_check_thirdParty_short_desc',
  'cookies_btn_cancel',
  'cookies_btn_save',
  'cookies_btn_all',
  'forgot_password_page_title',
  'forgot_password_email_field',
  'forgot_password_submit_btn',
  'forgot_password_success',
  'forgot_password_failed',
  'forgot_login_page_title',
  'forgot_login_success',
  'forgot_login_failed',
  'set_password_success',
  'set_password_failed',
  'reset_password_page_title',
  'reset_password_field',
  'reset_password_repeat_field',
  'reset_password_need_match_password',
  'responsible_gambling_title',
  'responsible_gambling_body',
  'responsible_gambling_close',
  'contact_page_failed_to_load',
  'contact_page_success',
  'questions_or_suggestions',
  'call_us',
  'time_workday',
  'time_weekend',
  'use_form_below',
  'contact_form_text',
  'forgot_password_text',
  'forgot_login_text',
  'sub_header_help',
  'sub_header_where_to_play',
  'sub_header_play_responsibly',
  'sitemap_page_title',
  'sitemap_cookiePolicy',
  'sitemap_faq',
  'sitemap_sports',
  'sitemap_register',
  'sitemap_promotions',
  'sitemap_deposit',
  'sitemap_settings',
  'sitemap_withdrawal',
  'sitemap_transactions',
  'sitemap_forgotPassword',
  'sitemap_resetPassword',
  'sitemap_forgotLogin',
  'sitemap_contactUs',
  'sitemap_securityPrivacy',
  'sitemap_preferences',
  'sitemap_findStore',
  'sitemap_playOnline',
  'sitemap_subscriptions',
  'sitemap_playResponsibly',
  'sitemap_whereToPlay',
  'sitemap_about',
  'sitemap_mission',
  'sitemap_charities',
  'sitemap_sponsorships',
  'sitemap_services',
  'sitemap_jobs',
  'sitemap_press',
  'sitemap_play',
  'sitemap_termsAndConditions',
  'sitemap_termsOfUse',
  'sitemap_CertsCodeConduct',
  'info_faq_title',
  'betting_rules_title',
  'custom_checkbox_checked',
  'custom_checkbox_unchecked',
  'moderation_gamble',
  'bnl_modal_footer_text_1',
  'bnl_modal_footer_text_2',
  'official_partners_title',
  'footer_info_text',
  'sitemap_aboutRetails',
  'sitemap_howToPlay',
  'sitemap_responsibleGaming',
  'sitemap_CertsCodeConduct',
  'sitemap_winnersWinnerOfTheDay',
  'sitemap_winnersHowToWin',
  'sitemap_sportsLive',
  'sitemap_sportsBettingHistory',
  'sitemap_sportsPromotions',
  'sitemap_bettingRules',
  'login_failed_to_login',
  'contact_page_field_required',
];

export const HEAD_DATA: HeadData = {
  title: 'test header',
};

export const NAVIGATION_ROUTES: ConfigRoute[] = [
  {
    path: '/',
    id: ComponentName.HomePage,
    name: 'home',
  },
  {
    path: '/cookie-policy',
    id: ComponentName.CookiePolicyPage,
    name: 'cookiePolicy',
  },
  {
    path: '/faq',
    id: ComponentName.FaqPage,
    name: 'faq',
  },
  {
    path: '/sports',
    id: ComponentName.SportsPage,
    name: 'sports',
  },
  {
    path: '/sports#filter/all/all/all/all/in-play',
    id: ComponentName.Null,
    name: 'sportsLive',
  },
  {
    path: '/sports#bethistory',
    id: ComponentName.Null,
    name: 'sportsBettingHistory',
    protected: true,
  },
  {
    path: '/sports#bethistory/rewards',
    id: ComponentName.Null,
    name: 'sportsPromotions',
    protected: true,
  },
  {
    path: '/sports/about_retails',
    id: ComponentName.TemplatePage,
    name: 'aboutRetails',
  },
  {
    path: '/sports/how_to_play',
    id: ComponentName.TemplatePage,
    name: 'howToPlay',
  },
  {
    path: '/sports/responsible_gaming',
    id: ComponentName.TemplatePage,
    name: 'responsibleGaming',
  },
  {
    path: '/register',
    id: ComponentName.RegisterPage,
    name: 'register',
  },
  {
    path: '/promotions',
    id: ComponentName.PromotionsPage,
    name: 'promotions',
  },
  {
    path: '/promotions/:slug',
    id: ComponentName.TemplatePage,
    name: 'promotion',
    hiddenSitemap: true,
  },
  {
    path: '/deposit',
    id: ComponentName.DepositPage,
    protected: true,
    name: 'deposit',
  },
  {
    path: '/deposit/:bankResponse',
    id: ComponentName.DepositPage,
    protected: true,
    name: 'depositResponse',
    hiddenSitemap: true,
  },
  // {
  //   path: '/limits',
  //   id: ComponentName.LimitsPage,
  //   protected: true,
  // },
  {
    path: '/settings',
    id: ComponentName.SettingsPage,
    protected: true,
    name: 'settings',
  },
  {
    path: '/withdrawal',
    id: ComponentName.WithdrawalPage,
    protected: true,
    name: 'withdrawal',
  },
  {
    path: '/sitemap',
    id: ComponentName.SitemapPage,
    name: 'sitemap',
    hiddenSitemap: true,
  },
  {
    path: '/transactions',
    id: ComponentName.TransactionsPage,
    protected: true,
    name: 'transactions',
  },
  {
    path: '/forgot_password',
    id: ComponentName.ForgotPasswordPage,
    name: 'forgotPassword',
  },
  {
    path: '/set_password/:code',
    id: ComponentName.ResetPasswordPage,
    name: 'resetPassword',
    hiddenSitemap: true,
  },
  {
    path: '/forgot_login',
    id: ComponentName.ForgotLoginPage,
    name: 'forgotLogin',
  },
  {
    path: '/contact_us',
    id: ComponentName.ContactUsPage,
    name: 'contactUs',
  },
  {
    path: '/security-privacy',
    id: ComponentName.TemplatePage,
    name: 'securityPrivacy',
  },
  {
    path: '/preferences',
    id: ComponentName.TemplatePage,
    name: 'preferences',
  },
  {
    path: '/find-store',
    id: ComponentName.TemplatePage,
    name: 'findStore',
  },
  {
    path: '/play-online',
    id: ComponentName.TemplatePage,
    name: 'playOnline',
  },
  {
    path: '/subscriptions',
    id: ComponentName.TemplatePage,
    name: 'subscriptions',
  },
  {
    path: '/play-responsibly',
    id: ComponentName.TemplatePage,
    name: 'playResponsibly',
  },
  {
    path: '/where-to-play',
    id: ComponentName.TemplatePage,
    name: 'whereToPlay',
  },
  {
    path: '/about',
    id: ComponentName.TemplatePage,
    name: 'about',
  },
  {
    path: '/mission',
    id: ComponentName.TemplatePage,
    name: 'mission',
  },
  {
    path: '/charities',
    id: ComponentName.TemplatePage,
    name: 'charities',
  },
  {
    path: '/sponsorships',
    id: ComponentName.TemplatePage,
    name: 'sponsorships',
  },
  {
    path: '/services',
    id: ComponentName.TemplatePage,
    name: 'services',
  },
  {
    path: '/jobs',
    id: ComponentName.TemplatePage,
    name: 'jobs',
  },
  {
    path: '/press',
    id: ComponentName.TemplatePage,
    name: 'press',
  },
  {
    path: '/play',
    id: ComponentName.TemplatePage,
    name: 'play',
  },
  {
    path: '/terms-and-conditions',
    id: ComponentName.TemplatePage,
    name: 'termsAndConditions',
  },
  {
    path: '/terms-of-use',
    id: ComponentName.TemplatePage,
    name: 'termsOfUse',
  },
  {
    path: '/certs-and-code-conduct',
    id: ComponentName.TemplatePage,
    name: 'CertsCodeConduct',
  },
  {
    path: '/winners/winner_of_the_day',
    id: ComponentName.TemplatePage,
    name: 'winnersWinnerOfTheDay',
  },
  {
    path: '/winners/how_to_win',
    id: ComponentName.TemplatePage,
    name: 'winnersHowToWin',
  },
  {
    path: '/betting-rules',
    id: ComponentName.BettingRulesPage,
    name: 'bettingRules',
  },
  {
    path: '*',
    id: ComponentName.TemplatePage,
    exact: false,
    name: '',
    hiddenSitemap: true,
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
            link: '/contact_us',
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
    mail: '#',
    facebook: '#',
    youtube: '#',
    twitter: '#',
  },
  partners: {
    reddevils: '#',
    redflames: '#',
    superleague: '#',
    rscs: '#',
  },
  links: FOOTER_LINKS,
  subFooter: {
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
        modal: ComponentName.CookiesModal,
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

export const REDIRECT_PROTECTED_NOT_LOGGED_IN = ComponentName.HomePage;

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
