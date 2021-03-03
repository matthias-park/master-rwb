import { PagesName } from '../constants';
import UserStatus from './UserStatus';
import { NavigationRoute } from './api/PageConfig';
import {
  HeaderRoute,
  FooterData,
  AvailableLocale,
  Sidebar,
} from './api/PageConfig';

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
};

export default Config;
