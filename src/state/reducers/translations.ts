import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { getApi } from '../../utils/apiUtils';
import { Config } from '../../constants';

export type Symbols = { [key: string]: string };

export const fetchTranslations = createAsyncThunk<
  Symbols,
  { locale: string; retryCount?: number }
>(
  'translations/fetchTranslations',
  async ({ locale, retryCount = 0 }, { dispatch, rejectWithValue }) => {
    const response = await getApi<RailsApiResponse<Symbols>>(
      '/restapi/v1/translations',
      { cache: 'no-cache' },
    ).catch(err => err);
    if (response?.Success) {
      return response.Data;
    }
    const canRetry = retryCount < 10;
    if (canRetry) {
      setTimeout(
        () => dispatch(fetchTranslations({ locale, retryCount: ++retryCount })),
        5000,
      ); //5sec timeout
    }
    return rejectWithValue(canRetry);
  },
);

const initialState: Symbols | null = Config?.translations || null;

export const translationsSlice = createSlice({
  name: 'translations',
  initialState,
  reducers: {
    //@ts-ignore
    addSymbols: (state, action: PayloadAction<Symbols>) => {
      if (!state) return action.payload;
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value;
      });
    },
  },
  extraReducers: builder => {
    builder.addCase(
      fetchTranslations.fulfilled,
      (_, action: PayloadAction<any>) => {
        return action.payload;
      },
    );
  },
});

export const { addSymbols } = translationsSlice.actions;

export default translationsSlice.reducer;
