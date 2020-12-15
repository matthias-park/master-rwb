import React, { useContext, createContext, ReactNode } from 'react';
import useSWR from 'swr';
import { getApi } from '../utils/apiUtils';
import Config from '../types/Config';
import { HEADER_ROUTES } from '../constants';
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
  const { data, mutate: mutateUser } = useSWR<UserStatus>(
    '/api/app/v1/user/status.json',
    getApi,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  // const { data: config } = useSWR('/api/init', getApi, {
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  // });
  // const value = useMemo(
  //   () => ({ ...config, user: user || { id: 0 }, mutateUser }),
  //   [config, user, mutateUser],
  // );
  const value = {
    headerRoutes: HEADER_ROUTES,
    theme: 'tonybet',
    user: data?.user || { id: 0 },
    mutateUser,
  };
  return <configContext.Provider value={value} {...props} />;
};
