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

const useUser = () => {
  const { addToast } = useToasts();
  const { data: userData, error: userError, mutate: mutateUser } = useSWR<
    UserStatus
  >(!TestEnv ? '/api/app/v1/user/status.json' : null, getApi, {
    revalidateOnFocus: true,
    refreshInterval: 300000, // 5 min
    onErrorRetry: error => {
      addToast(`Failed to fetch user data`, {
        appearance: 'error',
        autoDismiss: true,
      });
      console.log(error);
    },
  });
  const prevUser = usePrevious(userData?.user);
  useEffect(() => {
    if (
      !userData?.user.logout &&
      !userData?.user.logged_in &&
      prevUser?.logged_in
    ) {
      addToast(`User session ended`, {
        appearance: 'warning',
        autoDismiss: true,
      });
    }
  }, [userData, prevUser]);

  let user = { logged_in: false, loading: false };
  if (!userData && !userError) {
    user.loading = true;
  } else if (userData?.user && !userError) {
    user = userData.user;
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
  const [locale, changeLocale] = useState(
    getRedirectLocalePathname(locales, window.DEFAULT_LOCALE, routes),
  );

  const setLocale = (lang: string) => {
    setLocalePathname(lang);
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
