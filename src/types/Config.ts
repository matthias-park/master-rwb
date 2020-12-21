export interface ConfigRoute {
  id: string;
  path: string;
  protected?: true;
}

type Config = {
  user: any;
  mutateUser: (user?: any) => void;
  locale: string;
  locales: string[];
  setLocale: (lang: string) => void;
  routes: ConfigRoute[];
};

export default Config;
