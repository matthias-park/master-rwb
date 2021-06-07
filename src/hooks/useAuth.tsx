import React, {
  useContext,
  createContext,
  useEffect,
  ReactNode,
  useRef,
  useState,
} from 'react';
import { TestEnv } from '../constants';
import { useToasts } from 'react-toast-notifications';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useApi from './useApi';
import UserStatus, { NET_USER } from '../types/UserStatus';
import { getApi, postApi } from '../utils/apiUtils';
import useGTM from './useGTM';
import { useConfig } from './useConfig';
import { isMobile } from 'react-device-detect';
import { clearUserLocalStorage } from '../utils/';
import { useI18n } from './useI18n';
import { setUser as sentrySetUser } from '@sentry/react';
import { ConfigLoaded } from '../types/Config';

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

export const AuthContext = createContext<UserAuth | null>(null);

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

class StatusResponseError {
  notLoggedIn: boolean;

  constructor(res: RailsApiResponse<UserStatus>) {
    this.notLoggedIn = res.Code === 1;
  }
}

export const AuthProvider = ({ ...props }: I18nProviderProps) => {
  const { addToast } = useToasts();
  const sendDataToGTM = useGTM();
  const { configLoaded, locale } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const configEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && configEqual;
  });
  const { t } = useI18n();
  const loginClick = useRef(false);
  const [prevUser, setPrevUser] = useState<UserStatus | null>(null);
  const { data, error, mutate } = useApi<
    UserStatus | null,
    StatusResponseError
  >(
    !TestEnv ? '/railsapi/v1/user/status' : null,
    url =>
      getApi<RailsApiResponse<UserStatus>>(url).then(res => {
        if (!res.Success) throw new StatusResponseError(res);
        return res.Data;
      }),
    {
      revalidateOnFocus: true,
      refreshInterval: 300000, // 5 min
      onSuccess: data => {
        setPrevUser(data);
      },
      onErrorRetry: (
        error: StatusResponseError,
        _,
        _1,
        revalidate,
        { retryCount = 0 },
      ) => {
        if (error.notLoggedIn) {
          if (retryCount > 2) return;
          setTimeout(() => revalidate({ retryCount }), 2000);
        } else {
          if (retryCount > 10) return;
          setTimeout(() => revalidate({ retryCount }), 10000);
        }
      },
    },
  );
  let user: UserStatus =
    !error?.notLoggedIn && prevUser?.logged_in
      ? prevUser
      : { logged_in: false, loading: false };
  if (!data && !error) {
    user.loading = true;
  } else if (data && !error) {
    user = data;
    user.logged_in = !!user.id;
    user.loading = false;
  }
  user.login_click = loginClick.current;
  useEffect(() => {
    if (!user?.logout && !user?.logged_in && prevUser?.logged_in) {
      addToast(t('user_session_expired'), {
        appearance: 'warning',
        autoDismiss: true,
      });
    }
    if ((!prevUser || prevUser.logged_in) && !user.logged_in && !user.loading) {
      clearUserLocalStorage();
    }
  }, [data, prevUser]);
  useEffect(() => {
    if (!user.loading && configLoaded === ConfigLoaded.Loaded) {
      if (user.logged_in && user.id) {
        sentrySetUser({ id: user.id.toString() });
      }
      sendDataToGTM({
        'tglab.user.GUID': user.id,
        'tglab.user.LoginStatus': user.logged_in ? 'LoggedIn' : 'LoggedOut',
        'tglab.user.Platform': isMobile ? 'Mobile' : 'Desktop',
        'tglab.user.Language': locale,
        event: 'userStatusChange',
      });
    }
  }, [user.logged_in, user.loading, configLoaded]);

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
      loginClick.current = true;
      mutate(
        {
          id: res.Data!.PlayerId,
          balance: res.Data!.Balance.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }),
          logged_in: true,
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
