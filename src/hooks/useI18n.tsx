import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import i18n, { I18n } from '../utils/i18n';
import { postApi } from '../utils/apiUtils';
import { TRANSLATION_SYMBOLS } from '../constants';
import { useConfig } from './useConfig';
import { useToasts } from 'react-toast-notifications';
import useSWR from 'swr';

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
  const { addToast } = useToasts();
  const { locale } = useConfig();
  const params = useMemo(
    () => ({
      keys: TRANSLATION_SYMBOLS,
      lang: locale,
    }),
    [locale],
  );
  const { data } = useSWR<translationSymbol[]>(
    ['/railsapi/v1/translations', params],
    postApi,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        addToast(`Failed to fetch translations`, {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(error);
      },
    },
  );

  const [translations, setTranslations] = useState(() =>
    createLocale(locale, data),
  );

  useEffect(() => {
    setTranslations(createLocale(locale, data));
  }, [data, locale]);

  return <I18nContext.Provider value={translations} {...props} />;
};
