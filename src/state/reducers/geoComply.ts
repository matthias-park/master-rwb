import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import Lockr from 'lockr';
import { Config, ProdEnv } from '../../constants';
import { GeoComplyErrorCodes } from '../../types/GeoComply';
import GeoComplyState, {
  LocalStorageState,
} from '../../types/state/GeoComplyState';
import { setLogin } from './user';

const localStorageId = 'geoComplyValidation';

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
};

const saveStateToLocalStorage = (state: GeoComplyState) => {
  if (state.isGeoAllowed) {
    if (state.userId && state.userIp && state.revalidateIn) {
      state.savedState = {
        id: state.userId,
        ip: state.userIp,
        nextGeoCheck: dayjs()
          .add(Number(state.revalidateIn), 'second')
          .toJSON(),
      };
      Lockr.set(localStorageId, state.savedState);
    }
    state.error = null;
  } else {
    state.savedState = null;
    Lockr.rm(localStorageId);
  }
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
    } else if (!state.validationReason) {
      state.validationReason = !validSavedGeoLocation
        ? 'expired cache validation'
        : 'ip change';
    }
  } else if (!state.validationReason) {
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
      }
    },
    resetState: state => {
      Lockr.rm(localStorageId);
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
      };
    },
    setUserIp: (state, action: PayloadAction<string>) => {
      if (state.isGeoAllowed && state.userIp !== action.payload) {
        state.validationReason = 'ip change';
      }
      state.userIp = action.payload;
    },
    initGeo: () => {},
  },
  extraReducers: {
    [setLogin.toString()]: state => {
      if (!!window.__config__.geoComplyKey) {
        state.validationReason = 'login';
      }
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
} = geoComplySlice.actions;

export default geoComplySlice.reducer;
