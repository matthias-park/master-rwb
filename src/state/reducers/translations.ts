import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { getApi } from '../../utils/apiUtils';
import Lockr from 'lockr';
import * as Sentry from '@sentry/react';
import { LocalStorageKeys } from '../../constants';
import { getCachedConfigAndTranslations } from '../../utils';
import { setLocale } from './config';

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
    ).catch(() => null);
    if (response?.Success) {
      const responseLocale = response.Data?._locale_;
      if (responseLocale === locale) {
        Lockr.set(
          `${LocalStorageKeys.translations}-${responseLocale || locale}`,
          {
            ...response.Data,
            _cached_: true,
          },
        );
        return response.Data;
      } else {
        if (!responseLocale) {
          Sentry.captureMessage('fetch translations: no locale parameter');
        } else if (responseLocale !== locale) {
          Sentry.captureMessage('fetch translations: locale mismatch');
        }
        dispatch(setLocale(locale));
        return rejectWithValue(true);
      }
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

const initialState: Symbols | null = getCachedConfigAndTranslations()
  .translations;

export const translationsSlice = createSlice({
  name: 'translations',
  initialState,
  reducers: {
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
