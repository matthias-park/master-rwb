type Config = {
  headerRoutes: any[];
  user: any;
  mutateUser: (user?: any) => void;
  locale: string;
  setLocale: (lang: string) => void;
};

export default Config;
