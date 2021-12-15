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
  setGeoLocation,
  setLicense,
  setReady,
  setUserId,
  setValidationReason,
} from '../reducers/geoComply';
import Lockr from 'lockr';
import UserStatus from '../../types/UserStatus';
import { setLogout, setUser } from '../reducers/user';
import { ProdEnv } from '../../constants';

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
      if (!ProdEnv) {
        console.log('geoComply getting new license from server');
      }
      getApi<RailsApiResponse<GeoComplyLicense>>(
        '/restapi/v1/geocomply/license',
      ).then(res => {
        if (res.Success && res.Data.License) {
          Lockr.set(cacheKey, res.Data);
          setLicenseKey(res.Data.License, res.Data.ExpiresAtUtc);
          if (data.forceGetNewLicense) {
            dispatch(setValidationReason('licenseErrorRetry'));
          }
        }
      });
    } else {
      setLicenseKey(license, expiresAt);
    }
  }
};

const licenseKeyErrorCodes = [
  GeoComplyErrorCodes.CLNT_ERROR_LICENSE_EXPIRED,
  GeoComplyErrorCodes.CLNT_ERROR_INVALID_LICENSE_FORMAT,
  GeoComplyErrorCodes.CLNT_ERROR_CLIENT_LICENSE_UNAUTHORIZED,
];

let revalidateTimeout: number | null = null;
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
              dispatch(setReady());
              window.GeoComply?.Client.on('connect', () => {
                if (!ProdEnv) {
                  console.log('geoComply connected');
                }
                dispatch(setConnected(true));
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
                    if (!ProdEnv) {
                      console.log(
                        'geoComply no client software on pc NOT found - disconnecting',
                      );
                    }
                  }
                  if (!licenseKeyErrorCodes.includes(code)) {
                    dispatch(setError(code));
                  }
                })
                .on('geolocation', geoLocation => {
                  if (!ProdEnv) {
                    console.log('geoComply got geo-location hash');
                  }
                  dispatch(setGeoLocation(geoLocation));
                });
            }
          })
          .catch(() =>
            dispatch(setError(GeoComplyErrorCodes.FAILED_TO_LOAD_CLIENT)),
          );
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
      )
        .then(res => {
          if (
            res?.Data.Success &&
            res?.Data.Code === GeoComplyValidateCodes.Ok
          ) {
            if (!ProdEnv) {
              console.log(`geoComply-.net success validation`);
            }
          } else if (typeof res?.Data.Code === 'number') {
            if (!ProdEnv) {
              console.log(
                `geoComply-.net ERROR got code: ${res.Data.Code} message: ${res.Data.Message}`,
              );
            }
            if (state.error !== res.Data.Code) {
              dispatch(setError(res.Data.Code));
            }
          }
          dispatch(
            setGeoAllowed({
              isGeoAllowed: res?.Data.Code === GeoComplyValidateCodes.Ok,
              revalidateIn: res?.Data.GeolocateIn,
            }),
          );
        })
        .catch(() => {});
    },
  },
  [setGeoAllowed.toString()]: {
    before: (
      storeApi,
      actionPayload: { isGeoAllowed: boolean; revalidateIn: string | null },
    ) => {
      if (actionPayload.isGeoAllowed && actionPayload.revalidateIn) {
        if (!ProdEnv) {
          console.log(`revalidation in ${actionPayload.revalidateIn}sec`);
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
  return result;
};

export default geoComplyMiddleware;
