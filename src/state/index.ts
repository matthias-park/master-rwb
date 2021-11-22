import { configureStore } from '@reduxjs/toolkit';
import modals, { ModalsState } from './reducers/modals';
import * as Sentry from '@sentry/react';
import user from './reducers/user';
import config from './reducers/config';
import translations, { Symbols } from './reducers/translations';
import UserStatus from '../types/UserStatus';
import Config from '../types/Config';
import GeoComplyState from '../types/state/GeoComplyState';
import TgLabSb from '../types/TgLabSb';

const geoComplyEnabled = !!window.__config__.geoComplyKey;
const v2AuthEnabled = !!window.__config__.componentSettings?.v2Auth;
const tgLabSbEnabled = !!window.__config__.tgLabSb;

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  actionTransformer: action => {
    return null;
  },
  stateTransformer: (state: RootState) => {
    const transformedState = {
      ...state,
      config: null,
      translations: null,
      user: null,
      geoComply: {
        ...state.geoComply,
        license: null,
        geoLocation: null,
        savedState: null,
      },
    };
    return transformedState;
  },
});

const createStoreAsync = async () => {
  const asyncReduxMiddleware = [
    v2AuthEnabled && import('./middleware/userWebsocket'),
    geoComplyEnabled && import('./middleware/geoComply'),
  ].filter(Boolean) as Promise<any>[];
  let reducers: any = {
    modals,
    user,
    config,
    translations,
  };
  if (geoComplyEnabled) {
    await import('./reducers/geoComply').then(geoComply => {
      reducers = {
        ...reducers,
        geoComply: geoComply.default,
      };
    });
  }
  if (tgLabSbEnabled) {
    await import('./reducers/tgLabSb').then(tgLabSb => {
      reducers = {
        ...reducers,
        tgLabSb: tgLabSb.default,
      };
    });
  }
  const reduxMiddleware = await Promise.all(asyncReduxMiddleware)
    .then(modules => modules.map(module => module.default))
    .catch(() => []);
  return configureStore({
    reducer: reducers,
    middleware: defaultMiddleware =>
      defaultMiddleware().concat(reduxMiddleware),
    enhancers: [sentryReduxEnhancer],
  });
};
export type RootState = {
  geoComply: GeoComplyState;
  modals: ModalsState;
  user: UserStatus;
  tgLabSb: TgLabSb;
  config: Config;
  translations: Symbols | null;
};
export default createStoreAsync;
