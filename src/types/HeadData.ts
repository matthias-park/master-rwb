import {
  LinkHTMLAttributes,
  MetaHTMLAttributes,
  ScriptHTMLAttributes,
} from 'react';

interface HeadData {
  title: string;
  metas?: MetaHTMLAttributes<HTMLMetaElement>[];
  links?: LinkHTMLAttributes<HTMLLinkElement>[];
  scripts?: ScriptHTMLAttributes<HTMLScriptElement>[];
}

export default HeadData;
