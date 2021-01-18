import { ConfigRoute } from './types/Config';
import HeadData from './types/HeadData';
import HeaderLink from './types/HeaderLinks';

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

export const HEADER_ROUTES: HeaderLink[] = [
  {
    name: 'Home',
    path: '/',
    mobileLink: true,
    order: 0,
  },
  {
    name: 'Spelen',
    order: 1,
    cards: [
      {
        logo: '/assets/images/drawgames/loto.png',
        smallText: 'Nog 6 uur 52min',
        smallTextIcon: true,
        text: '€ 1.000.000',
        order: 1,
        color: 'red',
        button1: {
          name: 'Speel in de winkel',
          path: '#',
        },
        button2: {
          name: 'Speel online',
          path: '#',
        },
      },
      {
        logo: '/assets/images/drawgames/millions.png',
        smallText: 'vrijdag 21 september Jackpot van zo’n',
        text: '€ 89.000.000',
        order: 2,
        color: 'blue',
        button1: {
          name: 'Speel online',
          path: '#',
        },
        button2: {
          name: 'Speel online',
          path: '#',
        },
      },
      {
        logo: '/assets/images/drawgames/life.png',
        order: 3,
        color: 'purple',
      },
      {
        logo: '/assets/images/drawgames/cash.png',
        order: 4,
        color: 'yellow-dark',
      },
      {
        logo: '/assets/images/drawgames/woohoo.png',
        order: 5,
        color: 'red-light',
      },
      {
        logo: '/assets/images/drawgames/kraspelen.png',
        order: 6,
        color: 'blue-light',
      },
    ],
    bottomButton: {
      name: 'Alle resultaten',
      path: '#',
    },
  },
  {
    name: 'Resultaten',
    order: 2,
    cards: [
      {
        logo: '/assets/images/drawgames/loto.png',
        order: 1,
        color: 'red',
      },
      {
        logo: '/assets/images/drawgames/millions.png',
        order: 2,
        color: 'blue',
      },
      {
        logo: '/assets/images/drawgames/joker.png',
        order: 3,
        color: 'orange',
      },
      {
        logo: '/assets/images/drawgames/viking.png',
        order: 4,
        color: 'black',
      },
      {
        logo: '/assets/images/drawgames/keno.png',
        order: 5,
        color: 'purple',
      },
      {
        logo: '/assets/images/drawgames/3-pick.png',
        order: 6,
        color: 'yellow',
      },
      {
        logo: '/assets/images/drawgames/extra.png',
        order: 7,
        color: 'red',
      },
    ],
    bottomButton: {
      name: 'Alle resultaten',
      path: '#',
    },
  },
  {
    name: 'Winnaars',
    path: '#',
    order: 3,
  },
  {
    name: 'Meer dan spelen',
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
    name: 'Voordelen en acties',
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
  {
    name: 'Lottery Club',
    path: '#',
    order: 6,
  },
  {
    name: 'Scoore',
    path: '#',
    order: 7,
    externalLink: true,
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

export const AVAILABLE_LOCALES = ['en', 'nl', 'lt'];

export const FOOTER_LINKS = [
  {
    order: 1,
    children: [
      {
        name: 'Help',
        order: 1,
        children: [
          {
            name: 'FAQ',
            link: '/faq',
            order: 1,
          },
          {
            name: 'Contact',
            link: '/contact',
            order: 2,
          },
        ],
      },
      {
        name: 'Privacy',
        order: 2,
        children: [
          {
            name: 'Our privacy policy',
            link: '/security-privacy',
            order: 1,
          },
          {
            name: 'Manage your preferences',
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
        name: 'How and where can you play?',
        order: 1,
        children: [
          {
            name: 'Find a store',
            link: '/find-store',
            order: 1,
          },
          {
            name: 'Play online',
            link: '/play-online',
            order: 2,
          },
          {
            name: 'Subscriptions',
            link: '/subscriptions',
            order: 3,
          },
          {
            name: 'Play responsibly',
            link: '/play-responsibly',
            order: 4,
          },
          {
            name: 'All possibilities',
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
        name: 'More than playing',
        order: 1,
        children: [
          {
            name: 'About us',
            link: '/about',
            order: 1,
          },
          {
            name: ' Our mission and assignment',
            link: '/mission',
            order: 2,
          },
          {
            name: 'Charities',
            link: '/charities',
            order: 3,
          },
          {
            name: 'Grants and sponsorships',
            link: '/sponsorships',
            order: 4,
          },
          {
            name: 'Our services',
            link: '/services',
            order: 5,
          },
          {
            name: 'Jobs',
            link: '/jobs',
            order: 6,
          },
          {
            name: 'Press',
            link: '/press',
            order: 7,
          },
          {
            name: 'All over play',
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
    title: '®2018 Nationale Loterij',
    links: [
      {
        name: 'Algemene voorwaarden',
        link: '/terms-and-conditions',
        order: 0,
      },
      {
        name: 'Gebruiksvoorwaarden',
        link: '/terms-of-use',
        order: 1,
      },
      {
        name: 'Cookiebeleid',
        link: '/cookie-policy',
        order: 2,
      },
      {
        name: 'Certificaten en gedragscodes',
        link: '/certs-and-code-conduct',
        order: 3,
      },
      {
        name: 'Sitemap',
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
