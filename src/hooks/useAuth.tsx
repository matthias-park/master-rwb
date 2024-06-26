import React, {
  useContext,
  createContext,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import { ComponentSettings, LocalStorageKeys, TestEnv } from '../constants';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useApi from './useApi';
import UserStatus, { NET_USER, TwoFactorAuth } from '../types/UserStatus';
import { getApi, postApi } from '../utils/apiUtils';
import useGTM from './useGTM';
import { useConfig } from './useConfig';
import { isMobile } from 'react-device-detect';
import { ConfigLoaded } from '../types/Config';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  setLogout,
  setLogin,
  setUser,
  fetchUserBalance,
} from '../state/reducers/user';
import { RootState } from '../state';
import useIdleTicker from './useIdleTicker';
import Lockr from 'lockr';
import dayjs from 'dayjs';
export interface UserAuth {
  user: UserStatus;
  signin: (
    login: string,
    password: string,
    pin?: number,
  ) => Promise<{
    success: boolean;
    message: string | null;
    twoFactorAuthRequired?: boolean;
    total_deposit_count?: number;
    userActivationNeeded?: boolean;
  }>;
  signout: () => Promise<void>;
  updateUser: (forceUpdate?: boolean) => void;
}

export const AuthContext = createContext<UserAuth | null>(null);

export function useAuth(): UserAuth {
  const instance = useContext<UserAuth | null>(AuthContext);
  if (!instance) {
    throw new Error('There was an error getting auth instance from context');
  }
  return instance;
}

export type AuthProviderProps = {
  children?: ReactNode;
};

class StatusResponseError {
  notLoggedIn: boolean;

  constructor(res: RailsApiResponse<UserStatus>) {
    this.notLoggedIn = res.Code === 1;
  }
}

enum LoginStatus {
  ActivationNeeded = 9,
}

export const AuthProvider = ({ ...props }: AuthProviderProps) => {
  const retryCount = useRef(0);
  const sendDataToGTM = useGTM();
  const { configLoaded, locale } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const configEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && configEqual;
  });
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { error, mutate } = useApi<UserStatus | null, StatusResponseError>(
    !TestEnv && !window.PRERENDER_CACHE ? '/restapi/v1/user/status' : null,
    url =>
      getApi<RailsApiResponse<UserStatus>>(url).then(res => {
        if (!res.Success) throw new StatusResponseError(res);
        return res.Data;
      }),
    {
      revalidateOnFocus: !window.__config__.componentSettings?.v2Auth,
      refreshInterval: window.__config__.componentSettings?.v2Auth ? 0 : 600000, //v2 - disabled, otherwise - 10 min
      onSuccess: data => {
        retryCount.current = 0;
        let formattedUser: UserStatus = {
          logged_in: false,
          loading: false,
          needsSync: false,
        };
        if (data?.id != null) {
          formattedUser = {
            ...formattedUser,
            ...data,
            logged_in: !!data.id,
          };
        }
        if (!shallowEqual(user, formattedUser)) {
          dispatch(setUser(formattedUser));
        }
      },
      onErrorRetry: (
        error: StatusResponseError,
        _,
        _1,
        revalidate,
        options,
      ) => {
        retryCount.current++;
        const loggedOutUser = {
          logged_in: false,
          loading: false,
          needsSync: false,
        };
        if (error.notLoggedIn) {
          if (retryCount.current > 2 || !user.logged_in) {
            retryCount.current = 0;
            if (!shallowEqual(user, loggedOutUser))
              dispatch(setUser(loggedOutUser));
            return;
          }
          setTimeout(() => revalidate(options), 2000);
        } else {
          if (retryCount.current > 10) {
            retryCount.current = 0;
            if (!shallowEqual(user, loggedOutUser))
              dispatch(
                setUser({
                  logged_in: false,
                  loading: false,
                  needsSync: false,
                }),
              );
            return;
          }
          setTimeout(() => revalidate(options), 10000);
        }
      },
      isPaused: () =>
        !(user.needsSync || user.logged_in) || !!user.registration_id,
    },
  );
  useEffect(() => {
    if (!user.loading && configLoaded === ConfigLoaded.Loaded) {
      sendDataToGTM({
        'tglab.user.GUID': user.id,
        'tglab.user.LoginStatus': user.logged_in ? 'LoggedIn' : 'LoggedOut',
        'tglab.user.Platform': isMobile ? 'Mobile' : 'Desktop',
        'tglab.user.Language': locale || '',
        event: 'userStatusChange',
      });
      if (ComponentSettings?.useBalancesEndpoint && user.logged_in) {
        dispatch(fetchUserBalance());
      }
    }
  }, [user.logged_in, user.loading, configLoaded]);

  const signin = async (login: string, password: string, pin?: number) => {
    const res = await postApi<
      RailsApiResponse<NET_USER | TwoFactorAuth | null>
    >('/restapi/v1/user/login', {
      login,
      password,
      pin,
    }).catch((res: RailsApiResponse<null>) => res);
    const activationNeeded =
      (res?.Data as NET_USER)?.Code === LoginStatus.ActivationNeeded;
    if (res.Success && !activationNeeded) {
      if ((res.Data as TwoFactorAuth).authentication_required) {
        return {
          success: res.Success,
          message: res.Message,
          twoFactorAuthRequired: true,
        };
      }
      const data = res.Data as NET_USER;
      sendDataToGTM({
        'tglab.user.GUID': data.PlayerId!,
        event: 'SuccessfulLogin',
      });
      dispatch(setLogin(data));
      mutate();
    } else if (activationNeeded) {
      const data = res.Data as NET_USER;
      dispatch(setLogin(data));
      return {
        success: res.Success,
        message: res.Message,
        userActivationNeeded: true,
      };
    } else {
      sendDataToGTM({
        'tglab.Error': res.Message || 'request timeout',
        event: 'LoginFailed',
      });
    }
    Lockr.set(LocalStorageKeys.sessionStart, dayjs());
    return {
      success: res.Success,
      message: res.Message,
      total_deposit_count: (res.Data as NET_USER).total_deposit_count,
    };
  };
  const signout = async () => {
    if (Lockr.get(LocalStorageKeys.sessionStart))
      Lockr.rm(LocalStorageKeys.sessionStart);
    await getApi('/restapi/v1/user/logout').catch(err => err);
    dispatch(setLogout());
    return;
  };
  useIdleTicker(
    !!window.__config__.componentSettings?.userIdleTimeout && user.logged_in,
    signout,
  );
  const updateUser = async (forceUpdate: boolean = false) => {
    if ((!error && !retryCount.current && user.logged_in) || forceUpdate) {
      await mutate();
      return;
    }
  };
  const value: UserAuth = {
    user,
    signin,
    signout,
    updateUser,
  };
  return <AuthContext.Provider value={value} {...props} />;
};
