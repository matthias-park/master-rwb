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
};

export default Config;
