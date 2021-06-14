import { replaceStringTagsReact } from './reactUtils';
import { ALL_LOCALES } from '../constants';
import * as Sentry from '@sentry/react';

export type Symbols = { [key: string]: string };

const missingSymbolsSent: string[] = [];

const i18n = (lang: string, data: Symbols = {}) => {
  const hasTranslations = !!Object.keys(data).length;

  return {
    locale: lang,
    hasTranslations,
    symbols: data,
    t(key: string, noFallback: boolean = false) {
      if (
        hasTranslations &&
        !noFallback &&
        !data[key] &&
        !missingSymbolsSent.includes(key)
      ) {
        missingSymbolsSent.push(key);
        Sentry.captureMessage(`missing symbol:${key}`);
      }
      const val = data[key] || (noFallback ? '' : `missing symbol: ${key}`);
      return val;
    },
    jsxT(key: string, props: any = {}) {
      if (hasTranslations && !data[key] && !missingSymbolsSent.includes(key)) {
        missingSymbolsSent.push(key);
        Sentry.captureMessage(`missing symbol:${key}`);
      }
      const val = data[key] || `missing symbol: ${key}`;
      return replaceStringTagsReact(val, props);
    },
    addSymbols(data: Symbols) {},
  };
};

export const getWindowUrlLocale = (): string | null => {
  const windowPaths = window.location.pathname.split('/');
  let urlLocale = windowPaths[1];
  if (ALL_LOCALES.includes(urlLocale.toLocaleLowerCase())) {
    if (window.__config__.name === 'bnl' && urlLocale === 'de') {
      return 'fr';
    }
    return urlLocale;
  }
  return null;
};

export const setLocalePathname = (newlocale: string, reloadPage = true) => {
  const paths = window.location.pathname.split('/');
  if (ALL_LOCALES.includes(paths[1].toLocaleLowerCase())) {
    paths[1] = newlocale;
  } else {
    paths.splice(1, 0, newlocale);
  }
  if (reloadPage && !window.PRERENDER_CACHE) {
    const newPath = paths.join('/');
    window.location.pathname = newPath;
  } else {
    const newPath = paths.join('/') + window.location.hash;
    window.history.pushState({}, '', newPath);
  }
};

export type I18n = ReturnType<typeof i18n>;
export default i18n;
