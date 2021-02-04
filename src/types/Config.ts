import { ComponentName } from '../constants';
import UserStatus from './UserStatus';
import { User } from './UserStatus';
export interface ConfigRoute {
  id: ComponentName;
  path: string;
  protected?: boolean;
  exact?: boolean;
}

export interface Cookies {
  essential: boolean;
  functional: boolean;
  thirdParty: boolean;
}
export interface CookieSettings {
  cookies: Cookies;
  save: (cookies: Cookies) => void;
}

type Config = {
  user: User;
  mutateUser: (status?: UserStatus, shouldRevalidate?: boolean) => void;
  cookies: CookieSettings;
  locale: string;
  locales: string[];
  setLocale: (lang: string) => void;
  routes: ConfigRoute[];
};

export default Config;
