import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserStatus, { NET_USER } from '../../types/UserStatus';

const initialState: UserStatus = {
  logged_in: false,
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserStatus>) => {
      if (state.logged_in !== action.payload.logged_in) {
        return action.payload;
      }
      return { ...state, ...action.payload };
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
      };
    },
    setLogout: () => {
      return {
        ...initialState,
        logout: true,
      };
    },
    removeUserData: () => {
      return initialState;
    },
    setTwoFactoAuth: (state, action: PayloadAction<boolean>) => {
      state.authentication_enabled = action.payload;
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
} = userSlice.actions;

export default userSlice.reducer;
