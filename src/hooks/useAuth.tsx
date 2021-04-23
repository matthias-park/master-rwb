import React, { useContext, createContext, useEffect, ReactNode } from 'react';
import { TestEnv } from '../constants';
import { useToasts } from 'react-toast-notifications';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useApi from './useApi';
import UserStatus, { NET_USER } from '../types/UserStatus';
import { getApi, postApi } from '../utils/apiUtils';
import { usePrevious } from '.';
import useGTM from './useGTM';
import { useConfig } from './useConfig';
import { isMobile } from 'react-device-detect';

export interface UserAuth {
  user: UserStatus;
  signin: (
    email: string,
    password: string,
    remember_me: boolean,
  ) => Promise<{ success: boolean; message: string | null }>;
  signout: () => Promise<void>;
  updateUser: () => void;
}

const AuthContext = createContext<UserAuth | null>(null);

export function useAuth(): UserAuth {
  const instance = useContext<UserAuth | null>(AuthContext);
  if (!instance) {
    throw new Error('There was an error getting auth instance from context');
  }
  return instance;
}

export type I18nProviderProps = {
  children?: ReactNode;
};

export const AuthProvider = ({ ...props }: I18nProviderProps) => {
  const { addToast } = useToasts();
  const sendDataToGTM = useGTM();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const { data, error, mutate } = useApi<UserStatus | null>(
    !TestEnv ? '/railsapi/v1/user/status' : null,
    url => getApi<RailsApiResponse<UserStatus>>(url).then(res => res.Data),
    {
      revalidateOnFocus: true,
      refreshInterval: 300000, // 5 min
      // onErrorRetry: (err: RailsApiResponse<null>) => {
      //   if (err.Code !== 401) {
      //     addToast(`Failed to fetch user data`, {
      //       appearance: 'error',
      //       autoDismiss: true,
      //     });
      //   } else {
      //     return;
      //   }
      // },
    },
  );

  const prevUser = usePrevious(data);

  let user: UserStatus = { logged_in: false, loading: false };
  if (!data && !error) {
    user.loading = true;
  } else if (data && !error) {
    user = data;
    user.logged_in = !!user.id;
    user.loading = false;
  }

  useEffect(() => {
    if (!data?.logout && !data?.logged_in && prevUser?.logged_in) {
      addToast(`User session ended`, {
        appearance: 'warning',
        autoDismiss: true,
      });
    }
    sendDataToGTM({
      'tglab.user.LoginStatus': user.logged_in ? 'LoggedIn' : 'LoggedIout',
      'tglab.user.Platform': isMobile ? 'Mobile' : 'Desktop',
      'tglab.user.Language': locale,
      event: 'userStatusChange',
    });
  }, [data, prevUser]);

  const signin = async (
    email: string,
    password: string,
    remember_me: boolean,
  ) => {
    const res = await postApi<RailsApiResponse<NET_USER | null>>(
      '/railsapi/v1/user/login',
      {
        login: email.trim(),
        password,
        remember_me,
      },
    ).catch((res: RailsApiResponse<null>) => res);
    if (res.Success) {
      sendDataToGTM({
        'tglab.user.GUID': res.Data!.PlayerId!,
        event: 'SuccessfulLogin',
      });
      mutate(
        {
          id: res.Data!.PlayerId,
          balance: res.Data!.Balance.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }),
          logged_in: true,
          login_click: true,
          loading: false,
          name: res.Data!.Login,
        },
        true,
      );
    } else {
      sendDataToGTM({
        'tglab.Error': res.Message || 'request timeout',
        event: 'LoginFailed',
      });
    }
    return { success: res.Success, message: res.Message };
  };
  const signout = async () => {
    await getApi('/railsapi/v1/user/logout').catch(err => err);
    mutate({
      loading: false,
      logged_in: false,
      logout: true,
    });
    return;
  };
  const updateUser = () => mutate();
  const value: UserAuth = {
    user,
    signin,
    signout,
    updateUser,
  };
  return <AuthContext.Provider value={value} {...props} />;
};
