import React, { useContext, createContext, ReactNode, useState } from 'react';
import useSWR from 'swr';
import { getApi } from '../utils/apiUtils';
import Config from '../types/Config';
import UserStatus from '../types/UserStatus';
import { getRedirectLocalePathname, setLocalePathname } from '../utils/i18n';
import { AVAILABLE_LOCALES, NAVIGATION_ROUTES } from '../constants';
import { User } from '../types/UserStatus';

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
  const locales = AVAILABLE_LOCALES;
  const [locale, changeLocale] = useState(
    getRedirectLocalePathname(locales, window.DEFAULT_LOCALE, routes),
  );
  const { data: userData, error: userError, mutate: mutateUser } = useSWR<
    UserStatus
  >('/api/app/v1/user/status.json', getApi, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const setLocale = (lang: string) => {
    setLocalePathname(lang);
    changeLocale(lang);
  };
  const user: User = userData?.user || {
    logged_in: false,
    token: '',
    format: 'eu',
    id: 0,
    balance: '',
  };
  user.loading = !userData && !userError;

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
