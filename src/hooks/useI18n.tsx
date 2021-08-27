import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import i18n, { I18n, Symbols } from '../utils/i18n';
import { TestEnv } from '../constants';
import { useConfig } from './useConfig';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useApi from './useApi';
import { ConfigLoaded } from '../types/Config';
import useLocalStorage from './useLocalStorage';

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

interface Translations {
  [key: string]: string;
}

export const I18nProvider = ({ ...props }: I18nProviderProps) => {
  const { locale, configLoaded } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const loadedEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && loadedEqual;
  });
  const [cache, setCache] = useLocalStorage<{
    [key: string]: RailsApiResponse<Translations> | undefined;
  }>(`translations-cache`, {});
  const translationsUrl =
    !TestEnv && configLoaded === ConfigLoaded.Loaded && locale
      ? ['/railsapi/v1/translations', locale]
      : null;
  const { data, mutate } = useApi<RailsApiResponse<Translations>>(
    translationsUrl,
    {
      revalidateOnMount: true,
      onSuccess: data => {
        if (data?.Data?._locale_) {
          setCache({ ...(cache || {}), [data.Data._locale_]: data });
        }
      },
      onErrorRetry: (_, _1, _2, revalidate, { retryCount = 0 }) => {
        if (retryCount > 10) return;
        setTimeout(() => revalidate({ retryCount }), 2000);
      },
    },
  );

  const [translations, setTranslations] = useState(() =>
    i18n(
      data?.Data?._locale_ || cache?.[locale]?.Data?._locale_ || '',
      data?.Data || cache?.[locale]?.Data || {},
    ),
  );

  useEffect(() => {
    if (data?.Success) {
      mutate();
    }
  }, [locale]);

  useEffect(() => {
    if (data?.Data?._locale_)
      setTranslations(i18n(data.Data._locale_, data.Data, false));
    else mutate(undefined, true);
  }, [data?.Data]);

  const addSymbols = (data: Symbols) => {
    setTranslations(i18n(locale, { ...translations.symbols, ...data }));
  };

  return (
    <I18nContext.Provider value={{ ...translations, addSymbols }} {...props} />
  );
};
