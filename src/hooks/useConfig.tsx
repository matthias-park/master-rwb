import React, { useContext, createContext, ReactNode, useState } from 'react';
import useSWR from 'swr';
import Lockr from 'lockr';
import { getApi } from '../utils/apiUtils';
import Config from '../types/Config';
import { HEADER_ROUTES, NAVIGATION_ROUTES, HEAD_DATA } from '../constants';
import UserStatus from '../types/UserStatus';

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
  const [locale, changeLocale] = useState(Lockr.get('locale', 'en'));
  const { data, mutate: mutateUser } = useSWR<UserStatus>(
    '/api/app/v1/user/status.json',
    getApi,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const setLocale = (lang: string) => {
    Lockr.set('locale', lang);
    changeLocale(lang);
  };
  const value: Config = {
    headerRoutes: HEADER_ROUTES,
    user: data?.user || { id: 0 },
    mutateUser,
    locale,
    setLocale,
    headData: HEAD_DATA,
    routes: NAVIGATION_ROUTES,
  };
  return <configContext.Provider value={value} {...props} />;
};
