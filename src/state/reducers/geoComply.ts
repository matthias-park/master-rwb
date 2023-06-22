import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import Lockr from 'lockr';
import { ComponentSettings, Config, ProdEnv } from '../../constants';
import { GeoComplyErrorCodes } from '../../types/GeoComply';
import GeoComplyState, {
  LocalStorageState,
} from '../../types/state/GeoComplyState';
import { setLogin, setRegistered } from './user';
import * as Sentry from '@sentry/react';

const localStorageId = 'geoComplyValidation';
const localStorageRetryCountId = 'geoComplyRetryCount';

const initialState: GeoComplyState = {
  isReady: false,
  isConnecting: false,
  isConnected: false,
  isGeoAllowed: false,
  license: null,
  licenseExpiresAt: null,
  geoInProgress: false,
  error: null,
  geoLocation: null,
  wasConnected: false,
  revalidateIn: null,
  userId: null,
  validationReason: null,
  userIp: Config.ip,
  savedState: Lockr.get<LocalStorageState | null>(localStorageId, null),
  geoValidationInProgress: false,
  retryCount: Lockr.get(localStorageRetryCountId, 0),
  userLoggedIn: false,
};

const saveStateToLocalStorage = (state: GeoComplyState) => {
  if (!state.userId || !state.userIp) return;
  const savedGeoError = state.savedState?.geoError;
  state.savedState = {
    id: state.userId,
    ip: state.userIp,
  };
  if (state.isGeoAllowed) {
    if (state.revalidateIn) {
      state.savedState.nextGeoCheck = dayjs()
        .add(Number(state.revalidateIn), 'second')
        .toJSON();
    }
    state.error = null;
  } else {
    state.savedState.geoError = state.error || savedGeoError;
  }
  Lockr.set(localStorageId, state.savedState);
};
const restoreStateFromLocalStorage = (state: GeoComplyState) => {
  const { savedState } = state;
  const savedStateCurrentUser = savedState?.id === state.userId;
  const savedIpEqualCurrent = savedState?.ip === state.userIp;
  if (savedState && savedStateCurrentUser) {
    const validSavedGeoLocation = dayjs().isBefore(
      dayjs(savedState.nextGeoCheck),
    );
    if (validSavedGeoLocation && savedIpEqualCurrent) {
      state.geoInProgress = false;
      state.geoLocation = null;
      state.isGeoAllowed = true;
      state.revalidateIn = dayjs(savedState.nextGeoCheck)
        .diff(dayjs(), 'second')
        .toString();
      Sentry.addBreadcrumb({
        category: 'geocomply',
        type: 'navigation',
        message: `validation restored from cache, valid ${state.revalidateIn} seconds`,
        level: Sentry.Severity.Log,
      });
    } else if (!state.validationReason && !savedState.geoError) {
      Sentry.addBreadcrumb({
        category: 'geocomply',
        type: 'navigation',
        message: `cached validation expired, revalidating`,
        level: Sentry.Severity.Log,
      });
      state.validationReason = !validSavedGeoLocation
        ? 'expired cache validation'
        : 'ip change';
    }
  } else if (!state.validationReason && !state.userLoggedIn) {
    Sentry.addBreadcrumb({
      category: 'geocomply',
      type: 'navigation',
      message: `cached validation exist - ${!!savedState}, userId match - ${!!savedStateCurrentUser}`,
      level: Sentry.Severity.Warning,
    });
    state.error = GeoComplyErrorCodes.UserRejected;
  }
};

export const geoComplySlice = createSlice({
  name: 'geoComply',
  initialState,
  reducers: {
    setReady: state => {
      state.isReady = true;
    },
    setError: (state, action: PayloadAction<number>) => {
      state.error = action.payload;
      state.geoInProgress = false;
      state.validationReason = null;
      state.isConnecting = false;
    },
    connectToGeo: state => {
      state.isConnecting = true;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.wasConnected = action.payload;
      }
      state.isConnecting = false;
      state.isConnected = action.payload;
    },
    setGeoLocation: (state, action: PayloadAction<string | null>) => {
      state.geoLocation = action.payload;
      state.geoValidationInProgress = true;
    },
    setLicense: (
      state,
      action: PayloadAction<{
        license: string | null;
        expiresAt: string | null;
      }>,
    ) => {
      state.license = action.payload.license;
      state.licenseExpiresAt = action.payload.expiresAt;
      if (window.GeoComply?.Client.getLicense() !== action.payload) {
        if (!ProdEnv) {
          console.log('geoComply setting license');
        }
        window.GeoComply?.Client.setLicense(action.payload.license);
      }
    },
    setGeoAllowed: (
      state,
      action: PayloadAction<{ isGeoAllowed: boolean; revalidateIn?: string }>,
    ) => {
      const { isGeoAllowed, revalidateIn } = action.payload;
      state.isGeoAllowed = isGeoAllowed;
      state.geoInProgress = false;
      state.validationReason = null;
      state.revalidateIn = revalidateIn || null;
      state.geoValidationInProgress = false;
      if (isGeoAllowed) {
        state.error = null;
      }
      saveStateToLocalStorage(state);
    },
    setUserId: (state, action: PayloadAction<number>) => {
      if (state.isConnected && state.userId !== action.payload) {
        state.userId = action.payload;
        if (!ProdEnv) {
          console.log('geoComply setting user id');
        }
        window.GeoComply?.Client.setUserId(action.payload);
        restoreStateFromLocalStorage(state);
      }
    },
    setGeoInProgress: (state, action: PayloadAction<boolean>) => {
      state.geoInProgress = action.payload;
    },
    setValidationReason: (state, action: PayloadAction<string>) => {
      if (!state.validationReason) {
        state.validationReason = action.payload;
        Lockr.rm(localStorageId);
      }
    },
    clearValidation: state => {
      state.validationReason = null;
      state.geoValidationInProgress = false;
      state.geoInProgress = false;
      Lockr.rm(localStorageId);
    },
    resetState: state => {
      Lockr.rm(localStorageId);
      Lockr.rm(localStorageRetryCountId);
      return {
        ...state,
        isConnecting: false,
        isConnected: false,
        error: null,
        geoInProgress: false,
        geoLocation: null,
        isGeoAllowed: false,
        userId: null,
        revalidateIn: null,
        validationReason: null,
        savedState: null,
        geoValidationInProgress: false,
        retryCount: 0,
      };
    },
    setUserIp: (state, action: PayloadAction<string>) => {
      if (state.isGeoAllowed && state.userIp !== action.payload) {
        state.validationReason = 'ip change';
      }
      state.userIp = action.payload;
    },
    initGeo: () => {},
    setRetryCount: (state, action: PayloadAction<number>) => {
      state.retryCount = action.payload;
      Lockr.set(localStorageRetryCountId, state.retryCount);
      saveStateToLocalStorage(state);
    },
  },
  extraReducers: {
    [setLogin.toString()]: state => {
      if (!!Config.geoComplyKey && ComponentSettings?.geoComply?.checkOnLogin) {
        state.validationReason = 'login';
      }
      state.userLoggedIn = true;
    },
    [setRegistered.toString()]: state => {
      state.userLoggedIn = true;
    },
  },
});

export const {
  initGeo,
  setReady,
  setError,
  setConnected,
  setGeoLocation,
  setLicense,
  setGeoAllowed,
  resetState,
  setGeoInProgress,
  setUserId,
  setValidationReason,
  connectToGeo,
  setUserIp,
  setRetryCount,
  clearValidation,
} = geoComplySlice.actions;

export default geoComplySlice.reducer;
