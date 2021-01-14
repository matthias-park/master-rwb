import { User } from './UserStatus';
import { ComponentName } from '../constants';
export interface ConfigRoute {
  id: ComponentName;
  path: string | string[];
  protected?: boolean;
  exact?: boolean;
}

type Config = {
  user: User;
  mutateUser: (user?: any) => void;
  locale: string;
  locales: string[];
  setLocale: (lang: string) => void;
  routes: ConfigRoute[];
};

export default Config;
