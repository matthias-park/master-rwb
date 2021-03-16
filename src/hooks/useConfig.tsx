import React, {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  getApi,
  formatSuccesfullRailsApiResponse,
  postApi,
} from '../utils/apiUtils';
import Config from '../types/Config';
import UserStatus from '../types/UserStatus';
import { setLocalePathname, getWindowUrlLocale } from '../utils/i18n';
import { TestEnv } from '../constants';
import { useToasts } from 'react-toast-notifications';
import { usePrevious } from './index';
import useLocalStorage from './useLocalStorage';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { PageConfig } from '../types/api/PageConfig';
import useApi from './useApi';
import useMemoCompare from './useMemoCompare';

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
      refreshInterval: 30000, //300000, // 5 min
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
  return { user, mutateUser };
};

const useConstants = (): PageConfig | undefined => {
  const { addToast } = useToasts();
  const [cache, setCache] = useLocalStorage<PageConfig | null>(
    'cacheConstants',
    null,
  );
  const { data } = useApi<RailsApiResponse<PageConfig>>(
    '/railsapi/v1/content/constants',
    {
      initialData: cache
        ? formatSuccesfullRailsApiResponse<PageConfig>(cache)
        : undefined,
      revalidateOnMount: true,
      onErrorRetry: (err: RailsApiResponse<null>) => [
        addToast('Failed to get page config', {
          appearance: 'error',
          autoDismiss: true,
        }),
      ],
      onSuccess: data => {
        setCache(data.Data);
      },
    },
  );
  return data?.Data;
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
  const constants = useConstants();
  const locales = constants?.available_locales.map(locale => locale.iso) || [];
  const { user, mutateUser } = useUser();
  const [cachedLocale, setCachedLocale] = useLocalStorage<string | null>(
    'locale',
    null,
  );
  const [locale, changeLocale] = useState(
    cachedLocale || constants?.locale || '',
  );
  const [configLoaded, setConfigLoaded] = useState(false);
  useEffect(() => {
    if (constants) {
      const appLocale = locale || constants.locale;
      const detectedLocale = getWindowUrlLocale(constants.locale, locales);
      if (detectedLocale && appLocale !== detectedLocale) {
        (async () => {
          const detectedLocaleAvailable = locales.includes(
            detectedLocale.toLocaleLowerCase(),
          );
          if (!window.PRERENDER_CACHE && detectedLocaleAvailable) {
            await postApi('/railsapi/v1/locale', {
              locale: detectedLocale,
            });
          }
          setLocale(detectedLocaleAvailable ? detectedLocale : appLocale);
        })();
      } else {
        if (locale !== appLocale || !detectedLocale) {
          setLocale(appLocale);
        } else {
          setConfigLoaded(true);
        }
      }
    }
  }, [!!constants]);

  const setLocale = async (lang: string) => {
    setLocalePathname(lang);
    changeLocale(lang);
    setCachedLocale(lang);
    setConfigLoaded(true);
  };

  const value: Config = useMemo(
    () => ({
      user,
      mutateUser,
      locale,
      setLocale,
      locales: constants?.available_locales || [],
      routes: constants?.navigation_routes || [],
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
