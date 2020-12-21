import { ConfigRoute } from '../types/Config';
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

  if (availableLocales.includes(windowPaths[1])) {
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

export const setLocalePathname = (newlocale: string) => {
  const paths = window.location.pathname.split('/');
  paths[1] = newlocale;
  const newPath = paths.join('/');
  window.history.pushState({}, '', newPath);
};

export type I18n = ReturnType<typeof i18n>;
export default i18n;
