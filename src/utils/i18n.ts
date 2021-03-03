import Lockr from 'lockr';
import { postApi } from './apiUtils';
import { replaceStringTagsReact } from './reactUtils';
import { mutate } from 'swr';
import { NavigationRoute } from '../types/api/PageConfig';

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

export const getRedirectLocalePathname = (
  availableLocales: string[],
  defaultLocale: string,
  availableRoutes: NavigationRoute[],
) => {
  const windowPaths = window.location.pathname.split('/');
  let urlPaths = `${window.location.pathname}${window.location.hash}`;
  let urlLocale = Lockr.get('locale', defaultLocale);
  if (availableLocales.includes(windowPaths[1])) {
    urlLocale = windowPaths[1];
  } else if (availableRoutes.some(route => urlPaths.startsWith(route.path))) {
    urlPaths = `/${urlLocale}${urlPaths}`;
  } else {
    const urlPathWithoutFirstPath = urlPaths.replace(`/${windowPaths[1]}`, '');
    if (
      availableRoutes.some(route =>
        urlPathWithoutFirstPath.startsWith(route.path),
      )
    ) {
      urlPaths = `/${urlLocale}${urlPathWithoutFirstPath}`;
    } else {
      urlPaths = `/${urlLocale}`;
    }
  }

  if (window.location.pathname !== urlPaths) {
    window.history.replaceState({}, '', urlPaths);
  }
  if (!window.LOCALE || window.LOCALE !== urlLocale) {
    window.LOCALE = urlLocale;
    postApi('/railsapi/v1/locale', {
      locale: urlLocale,
    }).then(() => {
      mutate('/railsapi/v1/translations');
    });
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
