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
import { AVAILABLE_LOCALES, NAVIGATION_ROUTES, TestEnv } from '../constants';
import { useToasts } from 'react-toast-notifications';
import { usePrevious } from './index';
import useLocalStorage from './useLocalStorage';
import RailsApiResponse from '../types/api/RailsApiResponse';

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
  }
  return { user, mutateUser };
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
  const routes = NAVIGATION_ROUTES;
  const locales = AVAILABLE_LOCALES.map(locale => locale.iso);
  const { user, mutateUser } = useUser();
  const [storage] = useLocalStorage<Storage | null>('cookieSettings', null);
  const [locale, changeLocale] = useState(
    getRedirectLocalePathname(locales, window.DEFAULT_LOCALE, routes),
  );

  const setLocale = (lang: string) => {
    setLocalePathname(lang, storage?.functional ?? true);
    changeLocale(lang);
  };

  const value: Config = {
    user,
    mutateUser,
    locale,
    setLocale,
    locales,
    routes,
  };
  return <configContext.Provider value={value} {...props} />;
};
