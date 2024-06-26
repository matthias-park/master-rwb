import React, {
  ReactNode,
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { useAuth } from './useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state';
import * as stateActions from '../state/reducers/geoComply';
import { CustomWindowEvents, ProdEnv } from '../constants';
import dayjs from 'dayjs';
import * as Sentry from '@sentry/react';

type GeoComplyHookProviderProps = { children: ReactNode };

interface GeoComplyContext {
  isGeoValid: boolean;
  isGeoInProgress: boolean;
  errorCode: number | null;
  geoValidationInProgress: boolean;
  trigger: (reason: string) => void;
}
const geoComplyHookContext = createContext<GeoComplyContext | null>(null);

export function useGeoComply(): GeoComplyContext | null {
  const instance = useContext<GeoComplyContext | null>(geoComplyHookContext);
  if (!instance) {
    return null;
  }
  return instance;
}

export default useGeoComply;

export const GeoComplyProvider = ({ ...props }: GeoComplyHookProviderProps) => {
  const { user } = useAuth();
  const [focused, setFocused] = useState(0);
  const state = useSelector((state: RootState) => state.geoComply);
  const dispatch = useDispatch();
  const setFocus = useCallback(() => setFocused(prev => prev + 1), []);

  useEffect(() => {
    if (!state.isReady) {
      dispatch(stateActions.initGeo());
    }
    window.addEventListener('focus', setFocus);
    window.addEventListener(CustomWindowEvents.ResetIdleTimer, setFocus);

    return () => {
      window.removeEventListener('focus', setFocus);
      window.removeEventListener(CustomWindowEvents.ResetIdleTimer, setFocus);
    };
  }, []);

  useEffect(() => {
    if (state.isReady && !state.isConnecting && !state.isConnected) {
      dispatch(stateActions.connectToGeo());
    }
  }, [state.isReady, focused]);

  useEffect(() => {
    if (!state.userId && user.logged_in && user.id) {
      dispatch(stateActions.setUserId(user.id));
    }
  }, [state.isConnected]);

  useEffect(() => {
    if (state.validationReason) {
      const allowTrigger =
        state.isConnected &&
        !!state.license &&
        !state.geoInProgress &&
        !!state.userId &&
        state.validationReason &&
        dayjs(state.licenseExpiresAt).isAfter(dayjs());
      if (!ProdEnv) {
        console.log(
          `trigger geo location | connected ${
            state.isConnected
          } | geo In progress ${
            state.geoInProgress
          } | user logged in ${!!state.userId} | license set ${!!state.license} | reason ${
            state.validationReason
          }| license valid by date ${dayjs(state.licenseExpiresAt).isAfter(
            dayjs(),
          )} (${state.licenseExpiresAt}) | continue : ${allowTrigger}`,
        );
      }
      if (allowTrigger) {
        Sentry.addBreadcrumb({
          category: 'geocomply',
          type: 'navigation',
          message: `validation reason: ${state.validationReason}`,
          level: Sentry.Severity.Log,
        });
        if (!ProdEnv) {
          console.log(
            `geoComply location-check reason: ${state.validationReason}`,
          );
        }
        dispatch(stateActions.setGeoInProgress(true));
        window.GeoComply?.Client.setGeolocationReason(state.validationReason);
        window.GeoComply?.Client.requestGeolocation();
      }
    }
  }, [state.isConnected, state.validationReason, state.userId, state.license]);

  const trigger = (reason: string) =>
    dispatch(stateActions.setValidationReason(reason));

  const value: GeoComplyContext = {
    isGeoValid: state.isGeoAllowed && !state.error,
    isGeoInProgress: state.geoInProgress,
    errorCode: state.error,
    geoValidationInProgress: state.geoValidationInProgress,
    trigger,
  };
  return <geoComplyHookContext.Provider value={value} {...props} />;
};
