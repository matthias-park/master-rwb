import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserStatus, { NET_USER } from '../../types/UserStatus';
import { clearUserLocalStorage } from '../../utils';

const initialState: UserStatus = {
  logged_in: false,
  loading: true,
  needsSync: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserStatus>) => {
      if (!action.payload.logged_in) {
        clearUserLocalStorage();
      }
      if (state.registration_id) {
        return state;
      }
      if (state.logged_in !== action.payload.logged_in) {
        return action.payload;
      }
      return {
        ...state,
        ...action.payload,
      };
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setLogin: (_, action: PayloadAction<NET_USER>) => {
      return {
        id: action.payload.PlayerId,
        balance: action.payload.Balance,
        logged_in: true,
        loading: false,
        name: action.payload.Login,
        currency: action.payload.currency,
        token: action.payload.token,
        registration_id: action.payload.PlayerLoginRes?.RegistrationId,
      };
    },
    setRegistered: (_, action: PayloadAction<NET_USER>) => {
      return {
        id: action.payload.PlayerId,
        balance: 0,
        logged_in: true,
        loading: true,
        needsSync: true,
        name: action.payload.Login,
        registration_id: action.payload.registration_id,
      };
    },
    setLogout: () => {
      clearUserLocalStorage();
      return {
        ...initialState,
        logout: true,
        loading: false,
        needsSync: false,
      };
    },
    removeUserData: () => {
      clearUserLocalStorage();
      return initialState;
    },
    setTwoFactoAuth: (state, action: PayloadAction<boolean>) => {
      state.authentication_enabled = action.payload;
    },
    setValidationStatus: (state, action: PayloadAction<any>) => {
      state.validator_status = action.payload;
    },
    setUserActivated: state => {
      state.registration_id = null;
    },
  },
});

export const {
  setUser,
  removeUserData,
  setBalance,
  setLogout,
  setLogin,
  setTwoFactoAuth,
  setRegistered,
  setValidationStatus,
  setUserActivated,
} = userSlice.actions;

export default userSlice.reducer;
