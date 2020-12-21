import { ConfigRoute } from './types/Config';
import HeadData from './types/HeadData';
import HeaderLink from './types/HeaderLinks';

export const HEADER_ROUTES: HeaderLink[] = [
  {
    path: '/sports',
    name: 'link_sports',
  },
  {
    name: 'live_betting',
    children: [
      {
        name: 'link_sports',
        path: '/sports',
      },
    ],
  },
  {
    path: '/promotions',
    name: 'promotions',
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

export const WITHDRAWAL_LIST = [
  {
    cardName: 'Skrill',
    img:
      '/assets/shared/withdrawals/skrill-c81e4d4699bb51e2c5dbc135746b9956b0ef4de556e96272bf633ac5e0e78550.png',
    account: 'info@gmail.com',
    name: 'Test3555 Test4',
  },
  {
    cardName: 'Swedbank',
    img:
      '/assets/shared/withdrawals/swedbank-a1d02ee4d7123bfae9456e3c5adb6fe62c4844648e52bc3c008c442674c36167.png',
    account: 'LT54849515945159484',
    name: 'Test3555 Test4',
  },
  {
    cardName: 'Paysera',
    img:
      '/assets/shared/withdrawals/paysera-455a13bca8c563760ae083777ba8adcf43d3529efce20dfdd5a1967d7882cce4.png',
    account: 'ABbankasSnoras',
    name: 'Test3555 Test4',
  },
];

export const DEPOSIT_LIST = [
  {
    info: 'Transfer time 1-2 min.',
    img:
      'https://n.tonybet.com/uploads/1/payment_method/icon/75/paysafecard.jpg',
  },
  {
    info: 'Transfer time 1-2 min.',
    img: 'https://n.tonybet.com/uploads/1/payment_method/icon/78/mokejimai.png',
  },
  {
    info: 'Transfer time 1-2 min.',
    img: 'https://n.tonybet.com/uploads/1/payment_method/icon/15/skrill.gif',
  },
  {
    info: 'Transfer time 1-2 min.',
    img: 'https://n.tonybet.com/uploads/1/payment_method/icon/433/neteller.png',
  },
  {
    info: 'Transfer time 1-2 min.',
    img:
      'https://n.tonybet.com/uploads/1/payment_method/icon/453/wirecard_visa.png',
  },
  {
    info:
      'ransfer time up to 48hours, your balance will be updated once the transfer has been confirmed.',
    img:
      'https://n.tonybet.com/uploads/1/payment_method/icon/455/online-uberweisen-120x48.jpg',
  },
];

export const HEAD_DATA: HeadData = {
  title: 'test header',
};

export const NAVIGATION_ROUTES: ConfigRoute[] = [
  {
    path: '/',
    id: 'home',
  },
  {
    path: '/cookie-policy',
    id: 'cookiePolicy',
  },
  {
    path: '/faq',
    id: 'faq',
  },
  {
    path: '/sports',
    id: 'sports',
  },
  {
    path: '/login',
    id: 'login',
  },
  {
    path: '/register',
    id: 'register',
  },
  {
    path: '/promotions',
    id: 'promotions',
  },
  {
    path: '/bonus',
    id: 'bonus',
    protected: true,
  },
  {
    path: '/deposit',
    id: 'deposit',
    protected: true,
  },
  {
    path: '/limits',
    id: 'limits',
    protected: true,
  },
  {
    path: '/settings',
    id: 'settings',
    protected: true,
  },
  {
    path: '/withdrawal',
    id: 'withdrawal',
    protected: true,
  },
];

export const AVAILABLE_LOCALES = ['en', 'nl', 'lt'];

export const FOOTER_LINKS = [
  {
    name: 'Products',
    order: 1,
    children: [
      {
        name: 'Sports',
        link: '/sports',
        order: 1,
      },
      {
        name: 'InPlay',
        link: '/inplay',
        order: 2,
      },
      {
        name: 'Casino',
        link: '/casino',
        order: 3,
      },
      {
        name: 'Live Games',
        link: '/live-games',
        order: 4,
      },
      {
        name: 'Bet on Poker',
        link: '/bet-on-poker',
        order: 5,
      },
      {
        name: 'Live Casino',
        link: '/live-casino',
        order: 6,
      },
      {
        name: 'Promotions',
        link: '/promotions',
        order: 7,
      },
    ],
  },
  {
    name: 'Policies',
    order: 2,
    children: [
      {
        name: 'Security & Privacy',
        link: '/security-privacy',
        order: 1,
      },
      {
        name: 'Terms & Conditions',
        link: '/terms-conditions',
        order: 2,
      },
      {
        name: 'Betting rules',
        link: '/betting-rules',
        order: 3,
      },
      {
        name: 'Responsible Gambling',
        link: '/responsible-gambling',
        order: 4,
      },
    ],
  },
  {
    name: 'Company',
    order: 3,
    children: [
      {
        name: 'About Us',
        link: '/about-us',
        order: 1,
      },
      {
        name: 'Blog',
        link: '/blog',
        order: 2,
      },
      {
        name: 'News',
        link: '/news',
        order: 3,
      },
      {
        name: 'Affiliates',
        link: '/affiliates',
        order: 4,
      },
    ],
  },
  {
    name: 'Help',
    order: 4,
    children: [
      {
        name: 'FAQ',
        link: '/faq',
        order: 1,
      },
      {
        name: 'Payment Methods',
        link: '/payment-methods',
        order: 2,
      },
      {
        name: 'Contact Us',
        link: '/contact-us',
        order: 3,
      },
      {
        name: 'Statistics',
        link: '/statistics',
        order: 4,
      },
    ],
  },
  {
    name: 'Contact us',
    order: 5,
    children: [
      {
        name: '24/7 Customer Support',
        order: 1,
      },
      {
        name: 'info@tonybet.com',
        order: 2,
      },
    ],
  },
];
