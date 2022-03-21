import dayjs from 'dayjs';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { RootState } from '..';
import GeoComplyLicense from '../../types/api/geocomply/license';
import GeoComplyValidate, {
  GeoComplyValidateCodes,
} from '../../types/api/geocomply/validate';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import { GeoComplyErrorCodes } from '../../types/GeoComply';
import { getApi, postApi } from '../../utils/apiUtils';
import {
  connectToGeo,
  initGeo,
  resetState,
  setConnected,
  setError,
  setGeoAllowed,
  setGeoInProgress,
  setGeoLocation,
  setLicense,
  setReady,
  setUserId,
  setUserIp,
  setValidationReason,
} from '../reducers/geoComply';
import Lockr from 'lockr';
import UserStatus from '../../types/UserStatus';
import { setLogout, setUser } from '../reducers/user';
import { ComponentSettings, Config, ProdEnv } from '../../constants';
import * as Sentry from '@sentry/react';
import { Span, Transaction } from '@sentry/types';
import io from 'socket.io-client';

const insertGeoComplyScript = async (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const id = 'geoComplyClient';
    if (document.getElementById(id)) return resolve(false);
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.id = id;
    scriptElement.defer = true;
    scriptElement.setAttribute('src', `/scripts/geocomply-client.min.js`);
    scriptElement.addEventListener('load', () => resolve(true));
    scriptElement.addEventListener('error', err => reject(err));
    document.head.appendChild(scriptElement);
  });

let GeoValidationTransaction: Transaction | null = null;
let clearGeoComplyLicenseRetriesCount = 0;
const fetchSetLicenseKey = (
  storeApi: MiddlewareAPI<Dispatch<AnyAction>, any>,
  data: any = {},
) => {
  const state = (storeApi.getState() as RootState).geoComply;
  const { dispatch } = storeApi;
  const setLicenseKey = (license: string, expiresAt: string | null) => {
    dispatch(setLicense({ license, expiresAt }));
  };
  const userLoggedIn = (storeApi.getState() as RootState).user.logged_in;
  if (state.isConnected && userLoggedIn) {
    const cacheKey = 'geoComplyLicense';
    const cacheLicense = !data.forceGetNewLicense
      ? Lockr.get<GeoComplyLicense | null>(cacheKey, null)
      : null;
    const license = state.license || cacheLicense?.License;
    const expiresAt =
      state.licenseExpiresAt || cacheLicense?.ExpiresAtUtc || null;
    if (!ProdEnv) {
      console.log(
        `checking geoComply license | license: ${!!license} | isExpired: ${
          expiresAt && dayjs(expiresAt).isBefore(dayjs())
        } | force new license:${!!data.forceGetNewLicense}`,
      );
    }
    if (
      !license ||
      (expiresAt && dayjs(expiresAt).isBefore(dayjs())) ||
      data.forceGetNewLicense
    ) {
      Sentry.addBreadcrumb({
        category: 'geocomply',
        type: 'navigation',
        message: 'get geoComply license',
        level: Sentry.Severity.Log,
      });
      if (!ProdEnv) {
        console.log('geoComply getting new license from server');
      }
      getApi<RailsApiResponse<GeoComplyLicense>>(
        '/restapi/v1/geocomply/license',
        {
          sentryScope: GeoValidationTransaction,
        },
      )
        .then(res => {
          if (res.Success && res.Data.License) {
            Lockr.set(cacheKey, res.Data);
            setLicenseKey(res.Data.License, res.Data.ExpiresAtUtc);
            if (data.forceGetNewLicense) {
              dispatch(setValidationReason('licenseErrorRetry'));
            }
          } else {
            GeoValidationTransaction?.finish();
          }
        })
        .catch((err: RailsApiResponse<null>) => {
          GeoValidationTransaction?.finish();
          if (err.Unauthorized) return null;
          if (clearGeoComplyLicenseRetriesCount < 3) {
            clearGeoComplyLicenseRetriesCount++;
            return fetchSetLicenseKey(storeApi, data);
          }
          Sentry.captureMessage('geocomply license failed request');
          return false;
        });
    } else {
      setLicenseKey(license, expiresAt);
    }
  }
};

let clearGeoComplyValidationRetriesCount = 0;
const clearGeoComplyValidation = (user: UserStatus) => {
  if (!GeoValidationTransaction) {
    Sentry.withScope(scope => {
      scope.setUser({
        id: user.id?.toString(),
        email: user.email,
      });
      GeoValidationTransaction = Sentry.startTransaction({
        name: 'geoComply validation',
      });
      Sentry.getCurrentHub().configureScope(scope =>
        scope.setSpan(GeoValidationTransaction!),
      );
    });
  }
  postApi<RailsApiResponse<null>>(
    '/restapi/v1/user/clear_geocomply',
    {},
    {
      sentryScope: GeoValidationTransaction,
    },
  )
    .then(res => {
      clearGeoComplyValidationRetriesCount = 0;
      return res.Success;
    })
    .catch((err: RailsApiResponse<null>) => {
      GeoValidationTransaction?.finish();
      if (err.Unauthorized) return null;
      if (clearGeoComplyValidationRetriesCount < 3) {
        clearGeoComplyValidationRetriesCount++;
        return clearGeoComplyValidation(user);
      }
      Sentry.captureMessage('clear geocomply validation failed request');
      return false;
    });
};

const licenseKeyErrorCodes = [
  GeoComplyErrorCodes.CLNT_ERROR_LICENSE_EXPIRED,
  GeoComplyErrorCodes.CLNT_ERROR_INVALID_LICENSE_FORMAT,
  GeoComplyErrorCodes.CLNT_ERROR_CLIENT_LICENSE_UNAUTHORIZED,
];

const networkConnectionApi =
  //@ts-ignore
  navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const wsUrl = ComponentSettings?.v2Auth;
let socketIO: any = null;
const checkUserIp = async (): Promise<string | null> => {
  const span = GeoValidationTransaction?.startChild({
    op: 'ipCheck',
    description: `get user ip`,
  });
  if (Config.device?.isFirefox && wsUrl) {
    return new Promise(resolve => {
      span?.setTag('type', 'ws');
      socketIO = io(wsUrl, {
        transports: ['websocket', 'polling'],
        forceNew: true,
      });
      socketIO.on('connect_error', error => {
        Sentry.captureMessage(`ws ip check connect error ${error}`);
        if (error) span?.setData('error', error);
        span?.finish();
        return resolve(null);
      });
      socketIO.on('user-ip', ip => {
        socketIO.disconnect();
        span?.finish();
        return resolve(ip);
      });
      socketIO.on('connect', () => {
        socketIO.emit('get-ip');
      });
    });
  }
  span?.setTag('type', 'get');
  return getApi<string>(`${window.location.origin}/api/get-ip`, {
    responseText: true,
  })
    .catch(() => null)
    .finally(() => span?.finish());
};
let ipCheckLock = false;
const networkChangeEvent = async (
  storeApi: MiddlewareAPI<Dispatch<AnyAction>, any>,
) => {
  const geoComplyState = (storeApi.getState() as RootState).geoComply;
  if (
    !geoComplyState.isGeoAllowed ||
    geoComplyState.geoInProgress ||
    ipCheckLock
  ) {
    return;
  }
  ipCheckLock = true;
  const newIp = await checkUserIp();
  ipCheckLock = false;
  const currentIp = geoComplyState.userIp;
  if (newIp && currentIp && newIp !== currentIp) {
    Sentry.addBreadcrumb({
      category: 'geocomply',
      type: 'navigation',
      message: 'ip change, clearing validation ',
      level: Sentry.Severity.Log,
    });
    storeApi.dispatch(setUserIp(newIp));
  } else if (!newIp || !currentIp) {
    Sentry.captureMessage(
      `ip check failed: ${!newIp ? 'no new ip' : 'no current ip'}`,
    );
  }
};

let geoComplyValidationSentrySpan: Span | null = null;
let validationRequestRetriesCount = 0;
let revalidateTimeout: number | null = null;
let ipCheckInterval: number | null = null;
type actionFunction = (
  storeApi: MiddlewareAPI<Dispatch<AnyAction>, any>,
  actionPayload: any,
) => void;

const actions: {
  [key: string]: {
    before?: actionFunction;
    after?: actionFunction;
  };
} = {
  [initGeo.toString()]: {
    after: storeApi => {
      const state = (storeApi.getState() as RootState).geoComply;
      const { dispatch } = storeApi;
      if (!state.isReady) {
        if (!ProdEnv) {
          console.log('geoComply insert client script');
        }
        insertGeoComplyScript()
          .then(ready => {
            if (ready) {
              Sentry.addBreadcrumb({
                category: 'geocomply',
                type: 'navigation',
                message: 'geocomply ready',
                level: Sentry.Severity.Log,
              });
              dispatch(setReady());
              window.GeoComply?.Client.on('connect', () => {
                Sentry.addBreadcrumb({
                  category: 'geocomply',
                  type: 'navigation',
                  message: 'geocomply connected',
                  level: Sentry.Severity.Log,
                });
                if (!ProdEnv) {
                  console.log('geoComply connected');
                }
                dispatch(setConnected(true));
                if (networkConnectionApi) {
                  networkConnectionApi.addEventListener('change', () =>
                    networkChangeEvent(storeApi),
                  );
                }
                window.addEventListener('beforeunload', () =>
                  window.GeoComply?.Client.disconnect(),
                );
              })
                .on('error', (code: number, msg: string) => {
                  const state = (storeApi.getState() as RootState).geoComply;
                  const currentGeoComplyConnected = window.GeoComply?.Client.isConnected();
                  if (state.isConnected !== currentGeoComplyConnected) {
                    dispatch(setConnected(currentGeoComplyConnected));
                  }
                  Sentry.addBreadcrumb({
                    category: 'geocomply',
                    type: 'navigation',
                    message: `geocomply error code: ${code} message: ${msg}`,
                    level: Sentry.Severity.Warning,
                  });
                  if (!ProdEnv) {
                    console.log(
                      `geoComply error code: ${code} message: ${msg}`,
                    );
                  }
                  if (
                    code ===
                    GeoComplyErrorCodes.CLNT_ERROR_LOCAL_SERVICE_UNAVAILABLE
                  ) {
                    window.GeoComply?.Client.disconnect();
                    dispatch(setConnected(false));
                    Sentry.addBreadcrumb({
                      category: 'geocomply',
                      type: 'navigation',
                      message: `geocomply client not found`,
                      level: Sentry.Severity.Warning,
                    });
                    if (!ProdEnv) {
                      console.log(
                        'geoComply no client software on pc NOT found - disconnecting',
                      );
                    }
                  }
                  if (
                    ![
                      GeoComplyErrorCodes.CLNT_ERROR_LOCAL_SERVICE_UNAVAILABLE,
                      GeoComplyErrorCodes.UserRejected,
                    ].includes(code)
                  ) {
                    Sentry.captureMessage('GeoComply: got error', {
                      level: Sentry.Severity.Fatal,
                      tags: {
                        code,
                      },
                    });
                  }
                  if (geoComplyValidationSentrySpan) {
                    geoComplyValidationSentrySpan.setData('code', code);
                    geoComplyValidationSentrySpan.finish();
                  }
                  GeoValidationTransaction?.setTag('geoComply.code', code);
                  GeoValidationTransaction?.finish();
                  GeoValidationTransaction = null;
                  if (!licenseKeyErrorCodes.includes(code)) {
                    dispatch(setError(code));
                  }
                })
                .on('geolocation', geoLocation => {
                  Sentry.addBreadcrumb({
                    category: 'geocomply',
                    type: 'navigation',
                    message: `geocomply got hash`,
                    level: Sentry.Severity.Log,
                  });
                  if (!ProdEnv) {
                    console.log('geoComply got geo-location hash');
                  }
                  if (geoComplyValidationSentrySpan) {
                    geoComplyValidationSentrySpan.setData('code', 0);
                    geoComplyValidationSentrySpan.finish();
                  }
                  GeoValidationTransaction?.setTag('geoComply.code', 0);
                  dispatch(setGeoLocation(geoLocation));
                })
                .on('log', (message: string) => {
                  if (!message.includes('Posting data to socket :')) {
                    Sentry.addBreadcrumb({
                      category: 'geocomply',
                      type: 'navigation',
                      message,
                      level: Sentry.Severity.Log,
                    });
                  }
                });
            }
          })
          .catch(() => {
            Sentry.captureMessage('GeoComply: failed to load js script', {
              level: Sentry.Severity.Fatal,
            });
            dispatch(setError(GeoComplyErrorCodes.FAILED_TO_LOAD_CLIENT));
          });
      }
    },
  },
  [connectToGeo.toString()]: {
    before: storeApi => {
      const state = (storeApi.getState() as RootState).geoComply;
      if (state.isReady && !state.isConnecting && !state.isConnected) {
        if (!ProdEnv) {
          console.log('connect to GeoComply');
        }
        const envId =
          process.env.TARGET_ENV === 'production' ? 'production' : 'staging';
        window.GeoComply?.Client.connect(window.__config__.geoComplyKey, envId);
      }
    },
  },
  [setGeoLocation.toString()]: {
    after: (storeApi, actionPayload: string) => {
      const state = (storeApi.getState() as RootState).geoComply;
      const { dispatch } = storeApi;
      postApi<RailsApiResponse<GeoComplyValidate>>(
        '/restapi/v1/geocomply/validate',
        {
          text: actionPayload,
        },
        {
          sentryScope: GeoValidationTransaction,
        },
      )
        .then(res => {
          validationRequestRetriesCount = 0;
          if (
            res?.Data.Success &&
            res?.Data.Code === GeoComplyValidateCodes.Ok
          ) {
            Sentry.addBreadcrumb({
              category: 'geocomply',
              type: 'navigation',
              message: `geocomply success validation`,
              level: Sentry.Severity.Log,
            });
            if (!ProdEnv) {
              console.log(`geoComply-.net success validation`);
            }
          } else if (typeof res?.Data.Code === 'number') {
            Sentry.addBreadcrumb({
              category: 'geocomply',
              type: 'navigation',
              message: `geocomply validation error: ${res.Data.Code}`,
              level: Sentry.Severity.Log,
            });
            if (!ProdEnv) {
              console.log(
                `geoComply-.net ERROR got code: ${res.Data.Code} message: ${res.Data.Message}`,
              );
            }
            if (state.error !== res.Data.Code) {
              dispatch(setError(res.Data.Code));
            }
          }
          GeoValidationTransaction?.setTag('validation.code', res?.Data.Code);
          dispatch(
            setGeoAllowed({
              isGeoAllowed: res?.Data.Code === GeoComplyValidateCodes.Ok,
              revalidateIn: res?.Data.GeolocateIn,
            }),
          );
        })
        .catch(err => {
          if (err.Unauthorized) return null;
          if (validationRequestRetriesCount < 3) {
            validationRequestRetriesCount++;
            return actions[setGeoLocation.toString()]!.after?.(
              storeApi,
              actionPayload,
            );
          }
          Sentry.captureMessage('geocomply hash validation failed request');
        })
        .finally(() => {
          if (GeoValidationTransaction) {
            GeoValidationTransaction.finish();
            GeoValidationTransaction = null;
          }
        });
    },
  },
  [setGeoAllowed.toString()]: {
    before: (
      storeApi,
      actionPayload: { isGeoAllowed: boolean; revalidateIn: string | null },
    ) => {
      if (revalidateTimeout) {
        clearTimeout(revalidateTimeout);
      }
      if (actionPayload.isGeoAllowed && actionPayload.revalidateIn) {
        Sentry.addBreadcrumb({
          category: 'geocomply',
          type: 'navigation',
          message: `revalidation in ${actionPayload.revalidateIn}sec`,
          level: Sentry.Severity.Log,
        });
        if (!ProdEnv) {
          console.log(`revalidation in ${actionPayload.revalidateIn}sec`);
        }
        if (!ipCheckInterval) {
          ipCheckInterval = setInterval(
            () => networkChangeEvent(storeApi),
            networkConnectionApi ? 30000 : 5000,
          );
        }
        const revalidateTimeInMs = parseInt(actionPayload.revalidateIn) * 1000;
        if (!isNaN(revalidateTimeInMs)) {
          revalidateTimeout = setTimeout(() => {
            if (!ProdEnv) {
              console.log('revalidate timeout');
            }
            storeApi.dispatch(setValidationReason('revalidate'));
          }, revalidateTimeInMs);
        }
      } else if (ipCheckInterval) {
        clearInterval(ipCheckInterval);
        ipCheckInterval = null;
      }
    },
  },
  [setUserId.toString()]: {
    after: (storeApi, actionPayload) => {
      fetchSetLicenseKey(storeApi);
      const state = (storeApi.getState() as RootState).geoComply;
      if (state.revalidateIn) {
        storeApi.dispatch(
          setGeoAllowed({
            isGeoAllowed: state.isGeoAllowed,
            revalidateIn: state.revalidateIn,
          }),
        );
      }
    },
  },
  [setError.toString()]: {
    before: (storeApi, actionPayload) => {
      const forceGetNewLicense = licenseKeyErrorCodes.includes(
        Number(actionPayload || 0),
      );
      if (forceGetNewLicense) {
        fetchSetLicenseKey(storeApi, {
          forceGetNewLicense,
        });
      }
    },
  },
  [setLogout.toString()]: {
    before: storeApi => {
      const { dispatch } = storeApi;
      Sentry.addBreadcrumb({
        category: 'geocomply',
        type: 'navigation',
        message: `geoComply cleanup`,
        level: Sentry.Severity.Log,
      });
      if (!ProdEnv) {
        console.log('geoComply cleanup');
      }
      window.GeoComply?.Client.disconnect();
      dispatch(resetState());
    },
  },
  [setUser.toString()]: {
    after: (storeApi, actionPayload) => {
      const state = (storeApi.getState() as RootState).geoComply;
      const data = actionPayload as UserStatus;
      const { dispatch } = storeApi;
      if (
        state.isConnected &&
        window.GeoComply?.Client.getUserId() &&
        !data.logged_in
      ) {
        if (!ProdEnv) {
          console.log('geoComply cleanup');
        }
        window.GeoComply?.Client.disconnect();
        dispatch(resetState());
      } else if (
        state.isConnected &&
        !window.GeoComply?.Client.getUserId() &&
        data.logged_in &&
        data.id
      ) {
        dispatch(setUserId(data.id));
      } else if (
        data.id &&
        state.error !==
          GeoComplyErrorCodes.CLNT_ERROR_LOCAL_SERVICE_UNAVAILABLE &&
        state.wasConnected &&
        !state.isConnected
      ) {
        Sentry.addBreadcrumb({
          category: 'geocomply',
          type: 'navigation',
          message: `reconnect after user change`,
          level: Sentry.Severity.Log,
        });
        if (!ProdEnv) {
          console.log('geoComply reconnect after user change');
        }
        dispatch(connectToGeo());
      }
    },
  },
  [setValidationReason.toString()]: {
    before: storeApi => {
      fetchSetLicenseKey(storeApi);
    },
  },
  [resetState.toString()]: {
    after: () => {
      if (revalidateTimeout) {
        if (!ProdEnv) {
          console.log('clearing revalidate');
        }
        clearTimeout(revalidateTimeout);
      }
      if (ipCheckInterval) {
        clearInterval(ipCheckInterval);
        ipCheckInterval = null;
      }
      GeoValidationTransaction?.finish();
    },
  },
  [setUserIp.toString()]: {
    before: (storeApi, actionPayload: string) => {
      const state = storeApi.getState() as RootState;
      if (state.geoComply.userIp !== actionPayload) {
        if (ipCheckInterval) {
          clearInterval(ipCheckInterval);
          ipCheckInterval = null;
        }
        clearGeoComplyValidation(state.user);
      }
    },
  },
  [setGeoInProgress.toString()]: {
    before: () => {
      if (GeoValidationTransaction) {
        geoComplyValidationSentrySpan = GeoValidationTransaction.startChild({
          op: 'geoComply',
          description: `get location hash`,
        });
      }
    },
  },
};
const geoComplyMiddleware: Middleware = storeApi => next => action => {
  const middlewareAction = actions[action.type];
  if (middlewareAction?.before) {
    middlewareAction.before(storeApi, action.payload);
  }
  const result = next(action);
  if (middlewareAction?.after) {
    middlewareAction.after(storeApi, action.payload);
  }
  const state = storeApi.getState() as RootState;
  if (
    !GeoValidationTransaction &&
    state.geoComply.isConnected &&
    state.geoComply.validationReason
  ) {
    Sentry.withScope(scope => {
      scope.setUser({
        id: state.user.id?.toString(),
        email: state.user.email,
      });
      GeoValidationTransaction = Sentry.startTransaction({
        name: 'geoComply validation',
        tags: {
          'geoComply.reason': state.geoComply.validationReason,
        },
      });
    });
    Sentry.getCurrentHub().configureScope(scope =>
      scope.setSpan(GeoValidationTransaction!),
    );
  } else if (
    GeoValidationTransaction &&
    state.geoComply.isConnected &&
    !GeoValidationTransaction.tags['geoComply.reason'] &&
    state.geoComply.validationReason
  ) {
    GeoValidationTransaction.setTag(
      'geoComply.reason',
      state.geoComply.validationReason,
    );
  }
  return result;
};

export default geoComplyMiddleware;
