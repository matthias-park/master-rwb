import React, {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { postApi } from '../utils/apiUtils';
import Config, { ConfigLoaded, Cookies } from '../types/Config';
import { setLocalePathname, getWindowUrlLocale } from '../utils/i18n';
import { useToasts } from 'react-toast-notifications';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { PageConfig } from '../types/api/PageConfig';
import useApi from './useApi';
import useMemoCompare from './useMemoCompare';
import { formatNavigationRoutes, sortDescending } from '../utils/index';
import useLocalStorage from './useLocalStorage';
import { setPageLoadingSpinner } from '../utils/uiUtils';

const useConstants = () => {
  const { addToast } = useToasts();
  const [cache, setCache] = useLocalStorage<
    RailsApiResponse<PageConfig> | undefined
  >('api-constants-cache', undefined);
  const constantsUrl = '/railsapi/v1/content/constants';
  const { data, mutate, error } = useApi<RailsApiResponse<PageConfig>>(
    constantsUrl,
    {
      initialData: cache,
      revalidateOnMount: true,
      onSuccess: data => {
        if (data.Success && data.Data.locale) {
          setCache({ ...data, Data: { ...data.Data, cached: true } });
        }
      },
      onErrorRetry: (err: RailsApiResponse<null>) => [
        addToast('Failed to get page config', {
          appearance: 'error',
          autoDismiss: true,
        }),
      ],
    },
  );
  // useEffect(() => {
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
  // }, []);
  const constants = useMemo(() => {
    const constants = data?.Data;
    if (constants?.navigation_routes) {
      constants.navigation_routes = formatNavigationRoutes(constants);
    }
    return constants;
  }, [data?.Data]);

  return {
    constants,
    updateConstants: mutate,
    constantsError: error,
    clearConstantsCache: () => setCache(undefined),
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

const initCookies: Cookies = {
  accepted: false,
  functional: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

export const ConfigProvider = ({ ...props }: ConfigProviderProps) => {
  const {
    constants,
    updateConstants,
    constantsError,
    clearConstantsCache,
  } = useConstants();
  const locales = constants?.available_locales?.map(locale => locale.iso) || [];
  const { addToast } = useToasts();
  const [cachedLocale, setCachedLocale] = useLocalStorage<string | null>(
    'locale',
    null,
  );
  const [configLoaded, setConfigLoaded] = useState(ConfigLoaded.Loading);
  const [cookies, setCookies] = useLocalStorage<Cookies>(
    'cookieSettings',
    initCookies,
    {
      setInitValue: true,
    },
  );
  useEffect(() => {
    window.toast = addToast;
  }, []);
  useEffect(() => {
    if (constants) {
      const setApiLocale = async (lang: string) => {
        if (!window.PRERENDER_CACHE) {
          await postApi('/railsapi/v1/locale', {
            locale: lang,
          }).then(() => {
            updateConstants();
          });
        }
      };
      const detectedLocale = getWindowUrlLocale();
      const detectedLocaleAvailable =
        detectedLocale?.toLocaleLowerCase() === 'en' ||
        (detectedLocale &&
          locales.includes(detectedLocale.toLocaleLowerCase()));
      let newLocale: string | null = null;
      if (!constants.locale && cachedLocale) {
        newLocale = cachedLocale;
      }
      if (detectedLocaleAvailable && constants.locale !== detectedLocale) {
        newLocale = detectedLocale;
      }
      if (!cachedLocale && !newLocale && constants.locale) {
        newLocale = constants.locale;
      }
      if (newLocale && !constants.cached) {
        (async () => {
          await setApiLocale(newLocale);
          setLocale(newLocale);
        })();
      } else if (!newLocale && configLoaded !== ConfigLoaded.Loaded) {
        if (!detectedLocale && constants.locale) {
          setLocale(constants.locale);
        } else {
          setConfigLoaded(ConfigLoaded.Loaded);
        }
      }
    } else if (constantsError) {
      setConfigLoaded(ConfigLoaded.Error);
    }
  }, [constants?.locale, constants?.cached, !!constantsError]);

  const setLocale = (lang: string, setPageLoading = false) => {
    if (setPageLoading) {
      setPageLoadingSpinner();
      setConfigLoaded(ConfigLoaded.Loading);
    }
    if (lang !== constants?.locale) {
      clearConstantsCache();
    }
    setLocalePathname(lang);
    setCachedLocale(lang);
    setConfigLoaded(ConfigLoaded.Loaded);
  };
  const value: Config = {
    locale: cachedLocale || '',
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
    cookies: {
      cookies,
      setCookies,
    },
  };
  return <configContext.Provider value={value} {...props} />;
};
