import { Middleware } from 'redux';
import { RootState } from '..';
import {
  fetchUserBalance,
  removeUserData,
  setBalance,
  setBalances,
  setLogin,
  setUser,
} from '../reducers/user';
import io from 'socket.io-client';
import StatusMessage from '../../types/WebsocketUserStatus';
import { enableModal } from '../reducers/modals';
import {
  ComponentName,
  ComponentSettings,
  Config,
  ProdEnv,
} from '../../constants';
import { mutate } from 'swr';
import * as Sentry from '@sentry/react';
import { setUserIp } from '../reducers/geoComply';
import { injectTrackerScript } from '../../utils/uiUtils';

let userSocketIO;
const userWebsocketMiddleware: Middleware = storeApi => next => action => {
  if (window.__config__.componentSettings?.v2Auth) {
    if ([setUser.toString(), setLogin.toString()].includes(action.type)) {
      const store = storeApi.getState() as RootState;
      if (action.payload.token && action.payload.token !== store.user.token) {
        if (userSocketIO) userSocketIO.disconnect();
        userSocketIO = io(window.__config__.componentSettings.v2Auth, {
          transports: ['websocket', 'polling'],
        });
        userSocketIO.on('connect_error', () => {
          if (!ProdEnv) {
            console.log('websockets connection error');
          }
          Sentry.captureMessage('websocket connect error');
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
              if (ComponentSettings?.useBalancesEndpoint) {
                storeApi.dispatch(fetchUserBalance() as any);
              } else if (wsData.data) {
                if (wsData.data?.balance_type?.includes('Kambi')) {
                  const user = (storeApi.getState() as RootState).user;
                  injectTrackerScript(
                    'betconfirm',
                    user.id,
                    user.currency,
                    wsData.data.amount,
                  );
                }
                storeApi.dispatch(setBalance(wsData.data.balance_after));
              }
              break;
            }
            case 'bank_account_changed': {
              mutate('/restapi/v1/withdrawals');
              break;
            }
            case 'auth_info': {
              if (!wsData.data?.auth_success) {
                Sentry.captureMessage('Websocket auth failed');
              }
              const store = storeApi.getState() as RootState;
              if (
                !!Config.geoComplyKey &&
                wsData.data?.user_ip &&
                store.geoComply.userIp !== wsData.data.user_ip
              ) {
                storeApi.dispatch(setUserIp(wsData.data.user_ip));
              }
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
