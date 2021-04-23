import React, {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { getApi, postApi } from '../utils/apiUtils';
import Config, { ConfigLoaded } from '../types/Config';
import UserStatus, { VALIDATOR_STATUS } from '../types/UserStatus';
import { setLocalePathname, getWindowUrlLocale } from '../utils/i18n';
import { TestEnv } from '../constants';
import { useToasts } from 'react-toast-notifications';
import { usePrevious } from './index';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { PageConfig } from '../types/api/PageConfig';
import useApi from './useApi';
import useMemoCompare from './useMemoCompare';
import { sortDescending } from '../utils/index';
import useLocalStorage from './useLocalStorage';

const useUser = () => {
  const { addToast } = useToasts();
  const {
    data: userData,
    error: userError,
    mutate: mutateUser,
  } = useApi<UserStatus | null>(
    !TestEnv ? '/railsapi/v1/user/status' : null,
    url => getApi<RailsApiResponse<UserStatus>>(url).then(res => res.Data),
    {
      revalidateOnFocus: true,
      refreshInterval: 300000, // 5 min
      onErrorRetry: (err: RailsApiResponse<null>) => {
        if (err.Code !== 401) {
          addToast(`Failed to fetch user data`, {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          return;
        }
      },
    },
  );

  const prevUser = usePrevious(userData);
  useEffect(() => {
    if (!userData?.logout && !userData?.logged_in && prevUser?.logged_in) {
      addToast(`User session ended`, {
        appearance: 'warning',
        autoDismiss: true,
      });
    }
  }, [userData, prevUser]);

  let user: UserStatus = { logged_in: false, loading: false };
  if (!userData && !userError) {
    user.loading = true;
  } else if (userData && !userError) {
    user = userData;
    user.logged_in = !!user.id;
    user.loading = false;
  }
  if (user.id === 963) user.validator_status = VALIDATOR_STATUS.MINOR_ERROR;

  return { user, mutateUser };
};

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
  const { user, mutateUser } = useUser();
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
      user,
      mutateUser,
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
    [user, locale, !!constants],
  );
  return <configContext.Provider value={value} {...props} />;
};
