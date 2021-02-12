import { ComponentName } from '../constants';
import UserStatus from './UserStatus';
export interface ConfigRoute {
  id: ComponentName;
  path: string;
  protected?: boolean;
  exact?: boolean;
}

type Config = {
  user: UserStatus;
  mutateUser: (status?: UserStatus, shouldRevalidate?: boolean) => void;
  locale: string;
  locales: string[];
  setLocale: (lang: string) => void;
  routes: ConfigRoute[];
};

export default Config;
