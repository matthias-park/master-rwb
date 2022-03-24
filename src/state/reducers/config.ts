import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageConfig } from '../../types/api/PageConfig';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import Config, { ConfigLoaded, Cookies } from '../../types/Config';
import {
  formatNavigationRoutes,
  getCachedConfigAndTranslations,
} from '../../utils';
import { getApi, postApi } from '../../utils/apiUtils';
import Lockr from 'lockr';
import { LocalStorageKeys, RailsApiResponseFallback } from '../../constants';
import { getWindowUrlLocale, setLocalePathname } from '../../utils/i18n';
import {
  injectTrackerScript,
  removePageLoadingSpinner,
  setPageLoadingSpinner,
} from '../../utils/uiUtils';
import { WritableDraft } from '@reduxjs/toolkit/node_modules/immer/dist/internal';
import { fetchTranslations } from './translations';
import { RootState } from '..';
import { cache } from 'swr';

const setUserLocale = async (
  locale: string,
  updateRails = false,
): Promise<boolean> => {
  if (updateRails && !window.PRERENDER_CACHE) {
    const res = await postApi<RailsApiResponse<null>>('/restapi/v1/locale', {
      locale: locale,
    }).catch(() => RailsApiResponseFallback);
    if (!res.Success) return false;
  }
  setLocalePathname(locale);
  cache.clear();
  Lockr.set(LocalStorageKeys.locale, locale);
  return true;
};

const urlLocale = getWindowUrlLocale();
export const setLocale = createAsyncThunk<string, string, any>(
  'config/setLocale',
  async (locale: string, thunkAPI: any) => {
    const localeChangeSuccess = await setUserLocale(locale, true);
    if (localeChangeSuccess) {
      thunkAPI.dispatch(fetchTranslations({ locale }));
      return locale;
    }
    setTimeout(() => thunkAPI.dispatch(setLocale(locale)), 5000); //5sec timeout
    return thunkAPI.rejectWithValue();
  },
);

export const checkLocale = createAsyncThunk(
  'config/checkLocale',
  async (_, thunkAPI) => {
    const currentState = thunkAPI.getState() as RootState;
    const currentLocale = currentState.config.locale;
    const detectedLocale = getWindowUrlLocale();
    if (detectedLocale && currentLocale !== detectedLocale) {
      const detectedLocaleAvailable =
        detectedLocale === 'en' ||
        (detectedLocale &&
          currentState.config.locales.some(
            lang => lang.iso === detectedLocale,
          ));
      if (detectedLocaleAvailable) {
        thunkAPI.dispatch(setLocale(detectedLocale));
      }
    }
  },
);

export const fetchConstants = createAsyncThunk<PageConfig, number | undefined>(
  'config/fetchConfig',
  async (retryCount: number = 0, thunkAPI: any) => {
    const response = await getApi<RailsApiResponse<PageConfig>>(
      '/restapi/v1/content/constants',
      { cache: 'no-cache' },
    ).catch(err => err);

    if (response.Success && response?.Data) {
      const constants = response?.Data;
      if (constants?.navigation_routes) {
        constants.navigation_routes = formatNavigationRoutes(constants);
      }
      const railsLocale = constants.locale;
      let localeError = false;
      const savedUserLocale = Lockr.get(LocalStorageKeys.locale, null);
      let detectedLocale = urlLocale || savedUserLocale;
      const detectedLocaleAvailable =
        detectedLocale === 'en' ||
        (detectedLocale &&
          constants.available_locales.some(
            lang => lang.iso === detectedLocale,
          ));
      let forceSetLocale = false;
      if (window.__config__.name === 'bnl' && detectedLocale === 'de') {
        detectedLocale = savedUserLocale || 'fr';
        forceSetLocale = true;
      }
      if (
        detectedLocale &&
        ((railsLocale !== detectedLocale && detectedLocaleAvailable) ||
          forceSetLocale)
      ) {
        localeError = !(await setUserLocale(detectedLocale, true));
        if (!localeError) {
          constants.locale = detectedLocale;
        }
      } else if (
        railsLocale &&
        (!detectedLocaleAvailable || urlLocale == null)
      ) {
        setUserLocale(railsLocale);
      } else if (!constants.locale) {
        const defaultLocale = constants.available_locales.find(
          lang => lang.default,
        )?.iso;
        if (defaultLocale) setUserLocale(defaultLocale);
      }
      if (!localeError) {
        if (constants.locale) {
          thunkAPI.dispatch(fetchTranslations({ locale: constants.locale }));
        }
        return constants;
      }
    }
    const canRetry = retryCount < 10;
    if (canRetry) {
      setTimeout(() => thunkAPI.dispatch(fetchConstants(++retryCount)), 1000);
    }
    return thunkAPI.rejectWithValue(canRetry);
  },
);

export const getInitialState = () => getCachedConfigAndTranslations().config;

const initialState: Config | null = getInitialState();

const setPageLoader = (state: WritableDraft<Config>, show: boolean) => {
  if (show) {
    setPageLoadingSpinner();
  } else {
    removePageLoadingSpinner();
  }
  state.showPageLoader = show;
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setShowPageLoader: (state, action: PayloadAction<boolean>) =>
      setPageLoader(state, action.payload),
    setCookies: (state, action: PayloadAction<Cookies>) => {
      if (action.payload.accepted && !action.payload.marketing) {
        injectTrackerScript('cookies_consent');
      }
      Lockr.set(LocalStorageKeys.cookies, action.payload);
      state.cookies = action.payload;
    },
    setDomLoaded: state => {
      state.domLoaded = true;
      if (state.configLoaded !== ConfigLoaded.Loading) {
        setPageLoader(state, false);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchConstants.pending, state => {
        if (state.configLoaded === ConfigLoaded.Loaded) {
          setPageLoader(state, state.showPageLoader);
        }
      })
      .addCase(
        fetchConstants.fulfilled,
        (state, action: PayloadAction<PageConfig>) => {
          const {
            available_locales,
            footer_data,
            header_routes,
            help_block,
            locale,
            navigation_routes,
            sidebars,
            welcome_casino_categories,
            featured_casino_categories,
            custom_content_pages,
            hardcoded_categories_banners,
          } = action.payload;
          state.configLoaded = ConfigLoaded.Loaded;
          state.locales = available_locales;
          state.footer = footer_data;
          state.header = header_routes;
          state.helpBlock = help_block;
          state.routes = navigation_routes;
          state.sidebars = sidebars;
          state.welcomeCasinoCategories = welcome_casino_categories;
          state.featuredCasinoCategories = featured_casino_categories;
          state.locale = locale;
          state.customContentPages = custom_content_pages;
          state.hardcodedCategoriesBanners = hardcoded_categories_banners;
          Lockr.set(LocalStorageKeys.config, state);
          if (!locale && state.domLoaded) {
            setPageLoader(state, false);
          }
        },
      )
      .addCase(fetchConstants.rejected, (state, action: PayloadAction<any>) => {
        if (state.configLoaded === ConfigLoaded.Loading) {
          state.configLoaded = ConfigLoaded.Error;
        }
        if (!action.payload && state.showPageLoader) {
          setPageLoader(state, false);
        }
      })
      .addCase(setLocale.pending, state => {
        setPageLoader(state, true);
      })
      .addCase(setLocale.fulfilled, (state, action: PayloadAction<string>) => {
        state.locale = action.payload;
      })
      .addCase(fetchTranslations.fulfilled, state => {
        if (state.domLoaded) setPageLoader(state, false);
      })
      .addCase(
        fetchTranslations.rejected,
        (state, action: PayloadAction<any>) => {
          if (!action.payload && state.showPageLoader) {
            setPageLoader(state, false);
          }
        },
      );
  },
});

export const {
  setShowPageLoader,
  setCookies,
  setDomLoaded,
} = configSlice.actions;

export default configSlice.reducer;
