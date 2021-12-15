import { Middleware } from 'redux';
import { RootState } from '..';
import { removeUserData, setBalance, setUser } from '../reducers/user';
import io from 'socket.io-client';
import StatusMessage from '../../types/WebsocketUserStatus';
import { enableModal } from '../reducers/modals';
import { ComponentName, ProdEnv } from '../../constants';
import { mutate } from 'swr';
import * as Sentry from '@sentry/react';

let userSocketIO;
const userWebsocketMiddleware: Middleware = storeApi => next => action => {
  if (window.__config__.componentSettings?.v2Auth) {
    if (action.type === setUser.toString()) {
      const store = storeApi.getState() as RootState;
      if (action.payload.token && action.payload.token !== store.user.token) {
        if (userSocketIO) userSocketIO.disconnect();
        userSocketIO = io.connect(window.__config__.componentSettings.v2Auth, {
          transports: ['websocket', 'polling'],
        });
        userSocketIO.on('connect_error', err => {
          if (!ProdEnv) {
            console.log(err);
          }
          Sentry.captureEvent(new Error(err));
        });
        userSocketIO.on('message', (wsData: StatusMessage) => {
          switch (wsData.action) {
            case 'player_disabled': {
              storeApi.dispatch(enableModal(ComponentName.PlayerDisabledModal));
              storeApi.dispatch(removeUserData());
              break;
            }
            case 'bonus_wallet_changed':
            case 'balance_changed': {
              if (wsData.data) {
                storeApi.dispatch(setBalance(wsData.data.balance_after));
              }
              break;
            }
            case 'bank_account_changed': {
              mutate('/restapi/v1/withdrawals');
              break;
            }
          }
        });
        userSocketIO.on('connect', () => {
          userSocketIO.emit('join', action.payload.token);
        });
      } else if (!action.payload.token && userSocketIO) {
        userSocketIO.disconnect();
      }
    }
  }
  return next(action);
};

export default userWebsocketMiddleware;
