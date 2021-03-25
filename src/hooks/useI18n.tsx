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
import RailsApiResponse from '../types/api/RailsApiResponse';
import useApi from './useApi';
import { ConfigLoaded } from '../types/Config';

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
interface Translations {
  [key: string]: string;
}

export const I18nProvider = ({ ...props }: I18nProviderProps) => {
  const { addToast } = useToasts();
  const { locale, configLoaded } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const loadedEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && loadedEqual;
  });
  const translationsUrl = `/railsapi/v1/translations?locale=${locale}`;
  const { data, mutate } = useApi<RailsApiResponse<Translations>>(
    !TestEnv && configLoaded === ConfigLoaded.Loaded && locale
      ? translationsUrl
      : null,
    {
      revalidateOnMount: true,
      onErrorRetry: () => {
        addToast(`Failed to fetch translations`, {
          appearance: 'error',
          autoDismiss: true,
        });
      },
    },
  );

  useEffect(() => {
    navigator.serviceWorker?.addEventListener('message', async ({ data }) => {
      if (
        data.meta === 'workbox-broadcast-update' &&
        data.payload.updatedURL.includes(translationsUrl)
      ) {
        const { cacheName, updatedUrl } = data.payload;
        const cache = await caches.open(cacheName);
        const updatedResponse = await cache.match(updatedUrl);
        const updatedJson = updatedResponse && (await updatedResponse.json());
        mutate(updatedJson, false);
        console.log('translations updated');
      }
    });
  }, []);

  const [translations, setTranslations] = useState(() =>
    createLocale(locale, data?.Data),
  );

  useEffect(() => {
    if (data?.Success) {
      mutate();
    }
  }, [locale]);

  useEffect(() => {
    setTranslations(createLocale(locale, data?.Data));
  }, [data?.Data]);

  return <I18nContext.Provider value={translations} {...props} />;
};
