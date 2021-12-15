import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from '@reduxjs/toolkit/node_modules/immer/dist/internal';
import { RailsApiResponseFallback } from '../../constants';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import TgLabSb from '../../types/TgLabSb';
import { getApi } from '../../utils/apiUtils';
import { setLogout } from './user';

export const fetchUserSbToken = createAsyncThunk<string, number, any>(
  'tgLabSb/fetchUserSbToken',
  async (_, thunkAPI: any) => {
    const response = await getApi<RailsApiResponse<string>>(
      '/restapi/v1/user/sb_auth_token',
    ).catch(() => RailsApiResponseFallback);
    if (response.Data) {
      return response.Data;
    }
    return thunkAPI.rejectWithValue();
  },
);

const initialState: TgLabSb = {
  loaded: false,
  show: false,
  rendered: false,
  loadedLocale: null,
  uselessCounter: 0,
  sbSidebarVisible: false,
  userToken: null,
  sbShowBettingHistory: false,
};

const setShowState = (state: WritableDraft<TgLabSb>) => {
  const newShow = state.loaded && state.rendered;
  state.show = newShow;
};

export const tgLabSbSlice = createSlice({
  name: 'tgLabSb',
  initialState,
  reducers: {
    setSportsbookLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
      setShowState(state);
    },
    setRendered: (state, action: PayloadAction<boolean>) => {
      state.rendered = action.payload;
      setShowState(state);
    },
    setLoadedLocale: (state, action: PayloadAction<string>) => {
      state.loadedLocale = action.payload;
    },
    updateUselessCounter: state => {
      state.uselessCounter = ++state.uselessCounter;
    },
    setSidebarVisible: (state, action: PayloadAction<boolean>) => {
      state.sbSidebarVisible = action.payload;
    },
    setShowBettingHistory: (state, action: PayloadAction<boolean>) => {
      state.sbShowBettingHistory = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        fetchUserSbToken.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.userToken = action.payload;
        },
      )
      .addCase(fetchUserSbToken.rejected, state => {
        state.userToken = null;
      })
      .addCase(setLogout, state => {
        state.userToken = null;
      });
  },
});

export const {
  setSportsbookLoaded,
  setRendered,
  setLoadedLocale,
  updateUselessCounter,
  setSidebarVisible,
  setShowBettingHistory,
} = tgLabSbSlice.actions;

export default tgLabSbSlice.reducer;
