import { ConfigRoute } from '../types/Config';
import Lockr from 'lockr';

type Symbols = { [key: string]: { [key: string]: string } };

const i18n = () => {
  let locale = '';
  const symbols: Symbols = {};

  return {
    set(lang: string, data: unknown = {}) {
      symbols[lang] = Object.assign(symbols[lang] || {}, data);
    },

    locale(lang?: string) {
      return (locale = lang || locale);
    },

    table(lang: string) {
      return symbols[lang];
    },

    t(key: string, lang?: string) {
      //! Replace with empty string fallback
      const val = symbols?.[lang || locale]?.[key] || '';
      return val;
    },
  };
};

export const getRedirectLocalePathname = (
  availableLocales: string[],
  defaultLocale: string,
  availableRoutes: ConfigRoute[],
) => {
  const windowPaths = window.location.pathname.split('/');
  let urlLocale = defaultLocale;
  let urlPaths = window.location.pathname;
  const storageLocale = Lockr.get('locale');

  if (!storageLocale && availableLocales.includes(windowPaths[1])) {
    urlLocale = windowPaths[1];
  } else if (availableRoutes.some(route => route.path === urlPaths)) {
    urlPaths = `/${urlLocale}${urlPaths}`;
  } else {
    const urlPathWithoutFirstPath = urlPaths.replace(`/${windowPaths[1]}`, '');
    if (availableRoutes.some(route => route.path === urlPathWithoutFirstPath)) {
      urlPaths = `/${urlLocale}${urlPathWithoutFirstPath}`;
    } else {
      urlPaths = `/${urlLocale}`;
    }
  }

  if (window.location.pathname !== urlPaths) {
    window.history.replaceState({}, '', urlPaths);
  }
  return urlLocale;
};

export const setLocalePathname = (
  newlocale: string,
  saveToStorage?: boolean,
) => {
  const paths = window.location.pathname.split('/');
  paths[1] = newlocale;
  const newPath = paths.join('/');
  window.history.pushState({}, '', newPath);
  if (saveToStorage) {
    Lockr.set('locale', newlocale);
  }
};

export type I18n = ReturnType<typeof i18n>;
export default i18n;
