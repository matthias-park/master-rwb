import React, { useContext, createContext, ReactNode, useState } from 'react';
import useSWR from 'swr';
import { getApi } from '../utils/apiUtils';
import Config from '../types/Config';
import UserStatus from '../types/UserStatus';
import { getRedirectLocalePathname, setLocalePathname } from '../utils/i18n';
import { AVAILABLE_LOCALES, NAVIGATION_ROUTES } from '../constants';
import { useToasts } from 'react-toast-notifications';

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
  const { addToast } = useToasts();
  const routes = NAVIGATION_ROUTES;
  const locales = AVAILABLE_LOCALES;
  const [locale, changeLocale] = useState(
    getRedirectLocalePathname(locales, window.DEFAULT_LOCALE, routes),
  );
  const { data: userData, error: userError, mutate: mutateUser } = useSWR<
    UserStatus
  >('/api/app/v1/user/status.json', getApi, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      addToast(`Failed to fetch user data`, {
        appearance: 'error',
        autoDismiss: true,
      });
      console.log(error);
    },
  });
  const setLocale = (lang: string) => {
    setLocalePathname(lang);
    changeLocale(lang);
  };

  let user = { logged_in: false, loading: false };
  if (!userData && !userError) {
    user.loading = true;
  } else if (userData?.user && !userError) {
    user = userData.user;
  }

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
