import { PagesName } from '../constants';
import { NavigationRoute } from './api/PageConfig';
import {
  HeaderRoute,
  FooterData,
  AvailableLocale,
  Sidebar,
} from './api/PageConfig';

export enum ConfigLoaded {
  Loading = 0,
  Loaded = 1,
  Error = 2,
}
export interface Cookies {
  accepted: boolean;
  functional: boolean;
  marketing: boolean;
  analytics: boolean;
  personalization: boolean;
}
export interface CookiesConfig {
  cookies: Cookies;
  setCookies: (cookies: Cookies) => void;
}

type Config = {
  locale: string;
  locales: AvailableLocale[];
  setLocale: (lang: string, setPageLoading?: boolean) => void;
  routes: NavigationRoute[];
  header?: HeaderRoute[];
  footer?: FooterData;
  sidebars?: Array<Sidebar[]>;
  helpBlock?: PagesName[];
  configLoaded: ConfigLoaded;
  cookies: CookiesConfig;
};

export default Config;
