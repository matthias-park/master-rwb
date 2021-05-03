import { PagesName, ComponentName } from '../../constants';

export interface PageConfig {
  header_routes: HeaderRoute[];
  navigation_routes: NavigationRoute[];
  available_locales: AvailableLocale[];
  footer_data: FooterData;
  sidebars: Array<Sidebar[]>;
  help_block: PagesName[];
  locale: string | null;
}

export interface Sidebar {
  name: string;
  link: string;
}
export interface AvailableLocale {
  id: number;
  iso: string;
}

export interface FooterData {
  social: Social;
  partners: Partners;
  links: FooterDataLink[];
  subFooter: SubFooter;
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
  order: number;
  button?: boolean;
  modal?: ComponentName;
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
  name: string;
  prefix?: string;
  order: number;
  links: HeaderRouteLink[];
  externalLink?: boolean;
}

export interface HeaderRouteLink {
  text: string;
  path: string;
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
}
