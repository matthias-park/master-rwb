import { PagesName } from '../constants';
import UserStatus from './UserStatus';
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
  user: UserStatus;
  mutateUser: (status?: UserStatus, shouldRevalidate?: boolean) => void;
  locale: string;
  locales: AvailableLocale[];
  setLocale: (lang: string) => void;
  routes: NavigationRoute[];
  header?: HeaderRoute[];
  footer?: FooterData;
  sidebars?: Array<Sidebar[]>;
  helpBlock?: PagesName[];
  configLoaded: ConfigLoaded;
};

export default Config;
