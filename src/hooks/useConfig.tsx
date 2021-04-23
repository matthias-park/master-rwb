import React, {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { postApi } from '../utils/apiUtils';
import Config, { ConfigLoaded } from '../types/Config';
import { setLocalePathname, getWindowUrlLocale } from '../utils/i18n';
import { useToasts } from 'react-toast-notifications';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { PageConfig } from '../types/api/PageConfig';
import useApi from './useApi';
import useMemoCompare from './useMemoCompare';
import { sortDescending } from '../utils/index';
import useLocalStorage from './useLocalStorage';

const useConstants = () => {
  const { addToast } = useToasts();
  const constantsUrl = '/railsapi/v1/content/constants';
  const { data, mutate, error } = useApi<RailsApiResponse<PageConfig>>(
    constantsUrl,
    {
      revalidateOnMount: true,
      onErrorRetry: (err: RailsApiResponse<null>) => [
        addToast('Failed to get page config', {
          appearance: 'error',
          autoDismiss: true,
        }),
      ],
    },
  );
  useEffect(() => {
    /*navigator.serviceWorker.addEventListener('message', async ({ data }) => {
      if (
        data.meta === 'workbox-broadcast-update' &&
        data.payload.updatedURL.includes(constantsUrl)
      ) {
        const { cacheName, updatedUrl } = data.payload;
        const cache = await caches.open(cacheName);
        const updatedResponse = await cache.match(updatedUrl);
        const updatedJson = updatedResponse && (await updatedResponse.json());
        mutate(updatedJson, false);
        console.log('constants updated');
      }
    });*/
  }, []);
  return {
    constants: data?.Data,
    updateConstants: mutate,
    constantsError: error,
  };
};

export const configContext = createContext<Config | null>(null);

export function useConfig(
  compare?: (prev: Config, next: Config) => boolean,
): Config {
  const instance = useContext<Config | null>(configContext);
  if (!instance) {
    throw new Error('There was an error getting config instance from context');
  }
  return useMemoCompare<Config>(instance, compare);
}

export type ConfigProviderProps = {
  children?: ReactNode;
};

export const ConfigProvider = ({ ...props }: ConfigProviderProps) => {
  const { constants, updateConstants, constantsError } = useConstants();
  const locales = constants?.available_locales.map(locale => locale.iso) || [];
  const { addToast } = useToasts();
  const [cachedLocale, setCachedLocale] = useLocalStorage<string | null>(
    'locale',
    null,
  );
  const [locale, changeLocale] = useState(constants?.locale || '');
  const [configLoaded, setConfigLoaded] = useState(ConfigLoaded.Loading);
  useEffect(() => {
    window.toast = addToast;
  }, []);
  useEffect(() => {
    if (constants) {
      const appLocale = locale || constants.locale;
      const detectedLocale = getWindowUrlLocale();
      const detectedLocaleAvailable =
        detectedLocale?.toLocaleLowerCase() === 'en' ||
        (detectedLocale &&
          locales.includes(detectedLocale.toLocaleLowerCase()));
      if (!appLocale && cachedLocale) {
        (async () => {
          if (!window.PRERENDER_CACHE) {
            await postApi('/railsapi/v1/locale', {
              locale: cachedLocale,
            }).then(() => {
              updateConstants();
            });
          }
          setLocale(cachedLocale);
        })();
      } else if (
        appLocale &&
        detectedLocaleAvailable &&
        appLocale !== detectedLocale &&
        !!cachedLocale
      ) {
        (async () => {
          if (!window.PRERENDER_CACHE && detectedLocaleAvailable) {
            await postApi('/railsapi/v1/locale', {
              locale: detectedLocale!,
            }).then(() => {
              updateConstants();
            });
          }
          setLocale(detectedLocaleAvailable ? detectedLocale! : appLocale!);
        })();
      } else {
        if (appLocale && (locale !== appLocale || !detectedLocale)) {
          setLocale(appLocale);
        } else {
          setConfigLoaded(ConfigLoaded.Loaded);
        }
      }
    } else if (constantsError) {
      setConfigLoaded(ConfigLoaded.Error);
    }
  }, [!!constants, !!constantsError]);

  const setLocale = async (lang: string) => {
    changeLocale(lang);
    setLocalePathname(lang);
    setCachedLocale(lang);
    setConfigLoaded(ConfigLoaded.Loaded);
  };
  const value: Config = useMemo(
    () => ({
      locale,
      setLocale,
      locales: constants?.available_locales || [],
      routes:
        constants?.navigation_routes.sort((a, b) => {
          if (a.path === '*') return 1;
          if (b.path === '*') return -1;
          return sortDescending(a.path.length, b.path.length);
        }) || [],
      header: constants?.header_routes,
      footer: constants?.footer_data,
      sidebars: constants?.sidebars,
      helpBlock: constants?.help_block,
      configLoaded,
    }),
    [locale, !!constants],
  );
  return <configContext.Provider value={value} {...props} />;
};
