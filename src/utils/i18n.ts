import { replaceStringTagsReact } from './reactUtils';
import { ALL_LOCALES } from '../constants';
import * as Sentry from '@sentry/react';

export type Symbols = { [key: string]: string };

const missingSymbolsSent: string[] = [];

const i18n = (lang: string, data: Symbols = {}, cacheTranslations = true) => {
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
        !missingSymbolsSent.includes(key) &&
        !cacheTranslations
      ) {
        missingSymbolsSent.push(key);
        Sentry.captureMessage(`missing symbol:${key}`);
      }
      const val = data[key] || (noFallback ? '' : `missing symbol: ${key}`);
      return val;
    },
    jsxT(key: string, props: any = {}) {
      if (
        hasTranslations &&
        !data[key] &&
        !missingSymbolsSent.includes(key) &&
        !cacheTranslations
      ) {
        missingSymbolsSent.push(key);
        Sentry.captureMessage(`missing symbol:${key}`);
      }
      const val = data[key] || `missing symbol: ${key}`;
      return replaceStringTagsReact(val, props);
    },
  };
};

export const getWindowUrlLocale = (): string | null => {
  const windowPaths = window.location.pathname.split('/');
  let urlLocale = windowPaths[1];
  if (ALL_LOCALES.includes(urlLocale.toLocaleLowerCase())) {
    return urlLocale.toLocaleLowerCase();
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
  const newPath =
    paths.join('/') + window.location.hash + window.location.search;
  window.history.replaceState({}, '', newPath);
};

export type I18n = ReturnType<typeof i18n>;
export default i18n;
