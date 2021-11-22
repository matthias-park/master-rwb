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
import { CustomWindowEvents } from '../constants';
import dayjs from 'dayjs';
type GeoComplyHookProviderProps = { children: ReactNode };

interface GeoComplyContext {
  isGeoValid: boolean;
  isGeoInProgress: boolean;
  errorCode: number | null;
  trigger: (reason: string) => void;
}
const geoComplyHookContext = createContext<GeoComplyContext | null>(null);

export function useGeoComply(): GeoComplyContext {
  const instance = useContext<GeoComplyContext | null>(geoComplyHookContext);
  if (!instance) {
    throw new Error('There was an error getting i18n instance from context');
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
      console.log(
        `trigger geo location | connected ${
          state.isConnected
        } | geo In progress ${
          state.geoInProgress
        } | user logged in ${!!state.userId} | license set ${!!state.license} | reason ${
          state.validationReason
        }| license valid by date ${dayjs(state.licenseExpiresAt).isAfter(
          dayjs(),
        )} (${state.licenseExpiresAt}) | continue : ${!!(
          !!state.isConnected &&
          !!state.license &&
          !state.geoInProgress &&
          !!state.userId &&
          !!state.validationReason &&
          !!dayjs(state.licenseExpiresAt).isAfter(dayjs())
        )}`,
      );
      if (
        state.isConnected &&
        !!state.license &&
        !state.geoInProgress &&
        !!state.userId &&
        state.validationReason &&
        dayjs(state.licenseExpiresAt).isAfter(dayjs())
      ) {
        console.log(
          `geoComply location-check reason: ${state.validationReason}`,
        );
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
    trigger,
  };
  return <geoComplyHookContext.Provider value={value} {...props} />;
};
