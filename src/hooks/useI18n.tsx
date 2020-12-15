import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import i18n, { I18n } from '../utils/i18n';
import { postApi } from '../utils/apiUtils';
import { TRANSLATION_SYMBOLS } from '../constants';

export const I18nContext = createContext<I18n | null>(null);

export function useI18n(): I18n {
  const instance = useContext<I18n | null>(I18nContext);
  if (!instance) {
    throw new Error('There was an error getting i18n instance from context');
  }
  return instance;
}

export type I18nProviderProps = {
  children?: ReactNode;
};

const createLocale = (locale = 'en', data: unknown) => {
  const current = i18n();
  current.set(locale, data);
  current.locale(locale);
  return current;
};

interface translationSymbol {
  key: string;
  translation: string;
  lang: string;
  franchizeid: number;
}

export const I18nProvider = ({ ...props }: I18nProviderProps) => {
  const locale = 'en';
  const [data, setData] = useState({});
  useEffect(() => {
    (async () => {
      const trans = await postApi<translationSymbol[]>(
        '/translations/translate',
        {
          keys: TRANSLATION_SYMBOLS,
          lang_fr: [
            {
              fr: 1,
              lang: [locale],
            },
          ],
        },
      );
      setData(
        trans.reduce((obj, symbol) => {
          obj[symbol.key] = symbol.translation;
          return obj;
        }, {}),
      );
    })();
  }, []);
  const [translations, setTranslations] = useState(() =>
    createLocale(locale, data),
  );

  const hasChanged = translations.locale() !== locale;

  useEffect(() => {
    setTranslations(createLocale(locale, data));
  }, [hasChanged, data, locale]);

  return <I18nContext.Provider value={translations} {...props} />;
};
