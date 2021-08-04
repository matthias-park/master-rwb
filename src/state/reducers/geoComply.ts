import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import Lockr from 'lockr';
import { setLogin } from './user';
interface GeoComplyState {
  isReady: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  isGeoAllowed: boolean;
  error: number | null;
  geoLocation: string | null;
  license: string | null;
  geoInProgress: boolean;
  wasConnected: boolean;
  revalidateIn: string | null | undefined;
  userId: number | null;
  validationReason: string | null;
  savedState: LocalStorageState | null;
}

const localStorageId = 'geoComplyValidation';

const initialState: GeoComplyState = {
  isReady: false,
  isConnecting: false,
  isConnected: false,
  isGeoAllowed: false,
  license: null,
  geoInProgress: false,
  error: null,
  geoLocation: null,
  wasConnected: false,
  revalidateIn: null,
  userId: null,
  validationReason: null,
  savedState: Lockr.get<LocalStorageState | null>(localStorageId, null),
};
interface LocalStorageState {
  id: number;
  nextGeoCheck: string;
}

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
    },
    setLicense: (state, action: PayloadAction<string | null>) => {
      state.license = action.payload;
      if (window.GeoComply?.Client.getLicense() !== action.payload) {
        console.log('geoComply setting license');
        window.GeoComply?.Client.setLicense(action.payload);
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
      if (isGeoAllowed) {
        if (state.userId && revalidateIn) {
          state.savedState = {
            id: state.userId,
            nextGeoCheck: dayjs().add(Number(revalidateIn), 'second').toJSON(),
          };
          Lockr.set(localStorageId, state.savedState);
        }
        state.error = null;
      } else {
        state.savedState = null;
        Lockr.rm(localStorageId);
      }
    },
    setUserId: (state, action: PayloadAction<number>) => {
      if (state.isConnected && state.userId !== action.payload) {
        state.userId = action.payload;
        console.log('geoComply setting user id');
        window.GeoComply?.Client.setUserId(action.payload);
        const { savedState } = state;
        const savedStateCurrentUser = savedState?.id === action.payload;
        if (savedState && savedStateCurrentUser) {
          const validSavedGeoLocation = dayjs().isBefore(
            dayjs(savedState.nextGeoCheck),
          );
          if (validSavedGeoLocation) {
            state.geoInProgress = false;
            state.geoLocation = null;
            state.isGeoAllowed = true;
            state.revalidateIn = dayjs(savedState.nextGeoCheck)
              .diff(dayjs(), 'second')
              .toString();
          } else if (!state.validationReason) {
            state.validationReason = 'expiredCacheValidation';
          }
        } else {
          state.validationReason = 'login';
        }
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
      };
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
} = geoComplySlice.actions;

export default geoComplySlice.reducer;
