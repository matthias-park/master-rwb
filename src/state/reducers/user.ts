import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserStatus, { NET_USER } from '../../types/UserStatus';
import { clearUserLocalStorage } from '../../utils';
import { cache as SWRCache } from 'swr';
import * as Sentry from '@sentry/react';
import { injectTrackerScript } from '../../utils/uiUtils';
import UserBalances, {
  NullableUserBalances,
} from '../../types/api/user/Balances';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { getApi } from '../../utils/apiUtils';

export const fetchUserBalance = createAsyncThunk<
  UserBalances,
  number | undefined
>('user/fetchBalances', async (retryCount: number = 0, thunkAPI: any) => {
  const response = await getApi<RailsApiResponse<UserBalances>>(
    '/restapi/v1/user/balances',
    { cache: 'no-cache' },
  ).catch((res: RailsApiResponse<null>) => res);

  if (response.Success && response.Data?.playable_balance != null) {
    return response.Data;
  }
  const canRetry = retryCount < 10;
  if (canRetry) {
    setTimeout(() => thunkAPI.dispatch(fetchUserBalance(++retryCount)), 1000);
  }
  return thunkAPI.rejectWithValue(canRetry);
});

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
        SWRCache.clear();
        clearUserLocalStorage();
      }
      if (state.registration_id) {
        return state;
      }
      if (state.logged_in !== action.payload.logged_in) {
        return action.payload;
      }
      if (action.payload.id) {
        Sentry.setUser({
          id: action.payload.id?.toString(),
        });
      } else {
        Sentry.configureScope(scope => scope.setUser(null));
      }

      return {
        ...state,
        ...action.payload,
      };
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setBalances: (state, action: PayloadAction<NullableUserBalances>) => {
      if (state.balances) {
        state.balances = {
          ...state.balances,
          ...action.payload,
        };
        state.balances.playable_balance =
          state.balances.withdrawable_balance + state.balances.bonus_balance;
      }
    },
    setLogin: (_, action: PayloadAction<NET_USER>) => {
      injectTrackerScript('loggedin', action.payload.PlayerId);
      return {
        id: action.payload.PlayerId,
        balance: action.payload.Balance,
        canPlay: action.payload.CanPlay,
        logged_in: true,
        loading: false,
        name: action.payload.Login,
        currency: action.payload.currency,
        token: action.payload.token,
        registration_id: action.payload.PlayerLoginRes?.RegistrationId,
      };
    },
    setRegistered: (_, action: PayloadAction<NET_USER>) => {
      injectTrackerScript('regconfirm', action.payload.PlayerId);
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
  extraReducers: builder => {
    builder.addCase(
      fetchUserBalance.fulfilled,
      (state, action: PayloadAction<UserBalances>) => {
        state.balances = action.payload;
      },
    );
  },
});

export const {
  setUser,
  removeUserData,
  setBalance,
  setBalances,
  setLogout,
  setLogin,
  setTwoFactoAuth,
  setRegistered,
  setValidationStatus,
  setUserActivated,
} = userSlice.actions;

export default userSlice.reducer;
