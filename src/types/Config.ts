import {
  LinkHTMLAttributes,
  MetaHTMLAttributes,
  ScriptHTMLAttributes,
} from 'react';

export interface HeadData {
  title: string;
  metas?: MetaHTMLAttributes<HTMLMetaElement>[];
  links?: LinkHTMLAttributes<HTMLLinkElement>[];
  scripts?: ScriptHTMLAttributes<HTMLScriptElement>[];
}

export interface ConfigRoute {
  id: string;
  path: string;
  protected?: true;
}

type Config = {
  headerRoutes: any[];
  user: any;
  mutateUser: (user?: any) => void;
  locale: string;
  setLocale: (lang: string) => void;
  headData: HeadData;
  routes: ConfigRoute[];
};

export default Config;
