export interface PageConfig {
  header_routes: HeaderRoute[];
  navigation_routes: NavigationRoute[];
  available_locales: AvailableLocale[];
  footer_data: FooterData;
  sidebars: Array<Sidebar[]>;
  help_block: number[];
  locale: string | null;
  content_pages: { [key: string]: string[] };
}

export interface Sidebar {
  name: string;
  link: string;
  icon?: string;
  children?: {
    name: string;
    link: string;
  }[];
  main?: { name: string; link?: string; icon?: string; menu_name?: string }[];
  info_menu?: {
    name: string;
    link?: string;
    icon?: string;
    menu_name?: string;
    protected?: boolean;
  }[];
  sub_menu?: {
    name: string;
    link?: string;
    icon?: string;
    menu_name?: string;
  }[];
  expand_menus?: {
    name: string;
    children: { name: string; link?: string; icon?: string }[];
  }[];
}
export interface AvailableLocale {
  id: number;
  iso: string;
}

export interface FooterData {
  social?: Social;
  partners?: Partners;
  links?: FooterDataLink[];
  subFooter?: SubFooter;
  rowFooterPayments?: string[];
  rowFooterPartners?: { link: string; image: string }[];
  rowFooterLinks?: { title_symbol: string; link: string }[];
  rowFooterSocials?: { icon: string; link: string }[];
  rowFooterApps?: { name: string; link: string }[];
}

export interface FooterDataLink {
  order: number;
  children: Child[];
}

export interface Child {
  name: string;
  order: number;
  children: ChildElement[];
}

export interface ChildElement {
  name: string;
  link?: string;
  translationPath?: string;
  order: number;
  button?: boolean;
  modal?: number;
  external?: boolean;
}

export interface Partners {
  reddevils: string;
  redflames: string;
  superleague: string;
  rscs: string;
}

export interface Social {
  mail: string;
  facebook: string;
  youtube: string;
  twitter: string;
}

export interface SubFooter {
  links: ChildElement[];
}

export interface HeaderRoute {
  subLinks?: boolean;
  name: string;
  prefix?: string;
  order: number;
  links: HeaderRouteLink[];
  externalLink?: boolean;
}

export interface HeaderRouteLink {
  text: string;
  path?: string;
  translationPath?: string;
  order: number;
  onlyLoggedIn?: boolean;
}

export interface NavigationRoute {
  path: string;
  id: number;
  name: string;
  protected?: boolean;
  hiddenSitemap?: boolean;
  exact?: boolean;
  redirectTo?: string;
  order?: number;
  externalLinkTranslation?: string;
}
