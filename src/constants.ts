import { ConfigRoute } from './types/Config';
import HeadData from './types/HeadData';
import HeaderLink from './types/HeaderLinks';

export enum ComponentName {
  Header,
  Footer,
  LoginDropdown,
}

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
  {
    name: 'How and where can you play?',
    order: 3,
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
  {
    name: 'More than playing',
    order: 4,
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
