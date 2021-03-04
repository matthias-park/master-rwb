import React, {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import useSWR from 'swr';
import { getApi } from '../utils/apiUtils';
import Config from '../types/Config';
import UserStatus from '../types/UserStatus';
import { getRedirectLocalePathname, setLocalePathname } from '../utils/i18n';
import { TestEnv } from '../constants';
import { useToasts } from 'react-toast-notifications';
import { usePrevious } from './index';
import useLocalStorage from './useLocalStorage';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { PageConfig } from '../types/api/PageConfig';

const useUser = () => {
  const { addToast } = useToasts();
  const {
    data: userData,
    error: userError,
    mutate: mutateUser,
  } = useSWR<UserStatus | null>(
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

const useConstants = (): PageConfig | null => {
  const { addToast } = useToasts();
  const [cache, setCache] = useLocalStorage<PageConfig | null>(
    'cacheConstants',
    null,
  );
  const { data } = useSWR<RailsApiResponse<PageConfig>>(
    '/railsapi/v1/content/constants',
    {
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
  return data?.Data || cache;
};

export const configContext = createContext<Config | null>(null);

export function useConfig(): Config {
  const instance = useContext<Config | null>(configContext);
  if (!instance) {
    throw new Error('There was an error getting config instance from context');
  }
  return instance;
}

export type ConfigProviderProps = {
  children?: ReactNode;
};

export const ConfigProvider = ({ ...props }: ConfigProviderProps) => {
  const constants = useConstants();
  const locales = constants?.available_locales.map(locale => locale.iso) || [];
  const { user, mutateUser } = useUser();
  const [storage] = useLocalStorage<Storage | null>('cookieSettings', null);
  const [locale, changeLocale] = useState(window.DEFAULT_LOCALE);

  useEffect(() => {
    if (constants) {
      const detectedLocale = getRedirectLocalePathname(
        locales,
        window.DEFAULT_LOCALE,
        constants.navigation_routes,
      );
      if (locale !== detectedLocale) {
        changeLocale(detectedLocale);
      }
    }
  }, [locale, constants]);

  const setLocale = (lang: string) => {
    setLocalePathname(lang, storage?.functional ?? true);
    changeLocale(lang);
  };

  const value: Config = {
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
  };
  return <configContext.Provider value={value} {...props} />;
};
