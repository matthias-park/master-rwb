import {
  AnyAction,
  configureStore,
  Dispatch,
  Middleware,
} from '@reduxjs/toolkit';
import geoComplyMiddleware from './middleware/geoComply';
import userWebsocketMiddleware from './middleware/userWebsocket';
import geoComply from './reducers/geoComply';
import modals from './reducers/modals';
import user from './reducers/user';
import config from './reducers/config';
import translations from './reducers/translations';

const reduxMiddleware = [
  !!window.__config__.componentSettings?.v2Auth && userWebsocketMiddleware,
  !!window.__config__.geoComplyKey && geoComplyMiddleware,
].filter(Boolean) as Middleware<{}, any, Dispatch<AnyAction>>[];

const store = configureStore({
  reducer: {
    geoComply,
    modals,
    user,
    config,
    translations,
  },
  middleware: defaultMiddleware => defaultMiddleware().concat(reduxMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
