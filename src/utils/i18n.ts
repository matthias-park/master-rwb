import Lockr from 'lockr';
import { replaceStringTagsReact } from './reactUtils';
import { ALL_LOCALES } from '../constants';

type Symbols = { [key: string]: { [key: string]: string } };

const i18n = () => {
  let locale = '';
  const symbols: Symbols = {};

  return {
    set(lang: string, data: unknown = {}) {
      symbols[lang] = Object.assign(symbols[lang || locale] || {}, data);
    },

    locale(lang?: string) {
      return (locale = lang || locale);
    },

    table(lang: string) {
      return symbols[lang];
    },

    t(key: string, lang?: string) {
      const val = symbols?.[lang || locale]?.[key] || '';
      return val;
    },
    jsxT(key: string, lang?: string) {
      const val = symbols?.[lang || locale]?.[key] || '';
      return replaceStringTagsReact(val);
    },
  };
};

export const getWindowUrlLocale = (
  currentLocale: string,
  availableLocales: string[],
): string | null => {
  const savedLocale = Lockr.get('locale', null);
  if (!savedLocale) {
    return null;
  }

  const windowPaths = window.location.pathname.split('/');
  let urlLocale = windowPaths[1];
  if (ALL_LOCALES.includes(urlLocale.toLocaleLowerCase())) {
    return urlLocale;
  }
  return null;
};

export const setLocalePathname = (newlocale: string) => {
  const paths = window.location.pathname.split('/');
  if (ALL_LOCALES.includes(paths[1].toLocaleLowerCase())) {
    paths[1] = newlocale;
  } else {
    paths.splice(1, 0, newlocale);
  }
  const newPath = paths.join('/');
  window.history.pushState({}, '', newPath);
};

export type I18n = ReturnType<typeof i18n>;
export default i18n;
