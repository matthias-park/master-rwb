import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import i18n, { I18n } from '../utils/i18n';
import { TestEnv } from '../constants';
import { useConfig } from './useConfig';
import { useToasts } from 'react-toast-notifications';
import useSWR from 'swr';
import useLocalStorage from './useLocalStorage';
import RailsApiResponse from '../types/api/RailsApiResponse';

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

export const I18nProvider = ({ ...props }: I18nProviderProps) => {
  const { addToast } = useToasts();
  const { locale } = useConfig();
  const [i18nCache, setI18nCache] = useLocalStorage('translations', {});
  const { data } = useSWR<RailsApiResponse<{ [key: string]: string }>>(
    !TestEnv ? '/railsapi/v1/translations' : null,
    {
      onErrorRetry: () => {
        addToast(`Failed to fetch translations`, {
          appearance: 'error',
          autoDismiss: true,
        });
      },
      onSuccess: data => {
        setI18nCache(data);
      },
    },
  );
  const [translations, setTranslations] = useState(() =>
    createLocale(locale, data?.Data || i18nCache),
  );

  useEffect(() => {
    setTranslations(createLocale(locale, data?.Data || i18nCache));
  }, [data?.Data, locale]);

  return <I18nContext.Provider value={translations} {...props} />;
};
