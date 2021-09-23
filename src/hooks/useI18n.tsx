import { useSelector } from 'react-redux';
import { RootState } from '../state';
import { replaceStringTagsReact } from '../utils/reactUtils';
import * as Sentry from '@sentry/react';

const missingSymbolsSent: string[] = [];

interface I18n {
  t: (key: string, noFallback?: boolean) => any;
  jsxT: (key: string, props?: any) => any;
  hasTranslations: boolean;
  addSymbols: (symbols: any) => void;
}
export function useI18n(): I18n {
  const translationsSymbols = useSelector(
    (state: RootState) => state.translations,
  );
  const hasTranslations =
    !!translationsSymbols && !!Object.keys(translationsSymbols).length;
  const cacheTranslations = translationsSymbols?._cached_;
  const t = (key: string, noFallback: boolean = false) => {
    if (
      hasTranslations &&
      !noFallback &&
      !translationsSymbols?.[key] &&
      !missingSymbolsSent.includes(key) &&
      !cacheTranslations
    ) {
      missingSymbolsSent.push(key);
      Sentry.captureMessage(`missing symbol:${key}`);
    }
    const val =
      translationsSymbols?.[key] ||
      (noFallback ? '' : `missing symbol: ${key}`);
    return val;
  };
  const jsxT = (key: string, props: any = {}) => {
    if (
      hasTranslations &&
      !translationsSymbols?.[key] &&
      !missingSymbolsSent.includes(key) &&
      !cacheTranslations
    ) {
      missingSymbolsSent.push(key);
      Sentry.captureMessage(`missing symbol:${key}`);
    }
    const val = translationsSymbols?.[key] || `missing symbol: ${key}`;
    return replaceStringTagsReact(val, props);
  };
  return {
    hasTranslations,
    t,
    jsxT,
    addSymbols: () => {},
  };
}
