import fetch from 'isomorphic-unfetch';
import { ConfigInterface, mutate } from 'swr';
import { RailsApiResponseFallback } from '../constants';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { RegistrationPostalCodeAutofill } from '../types/api/user/Registration';
import { cleanPostBody } from '.';
import * as Sentry from '@sentry/react';
import { Transaction } from '@sentry/types';
import { spanStatusfromHttpCode } from '@sentry/tracing';

export const formatUrl = (
  url: string,
  params: { [key: string]: string | number | undefined } = {},
): string => {
  const paramsArr = Object.keys(params)
    .filter(key => params[key])
    .map(key => `${key}=${params[key]}`);
  return `${url}${paramsArr.length ? '?' : ''}${paramsArr.join('&')}`;
};

interface GetApiOptions {
  responseText?: boolean;
  cache?: RequestCache;
  sentryScope?: Transaction | null;
}

export const getApi = <T>(
  url: string,
  options: GetApiOptions = {},
): Promise<T> => {
  const config: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    cache: options.cache,
    headers: new Headers(),
  };
  if (window.user_locale) {
    (config.headers as Headers).append('content-language', window.user_locale);
  }
  const currentSentryTransaction =
    options.sentryScope || Sentry.getCurrentHub()?.getScope()?.getTransaction();
  const httpSpan = currentSentryTransaction?.startChild({
    op: 'http',
    description: `GET ${url}`,
  });
  const getUrl = url.startsWith('http')
    ? url
    : `${window.__config__.apiUrl}${url}`;
  return fetch(getUrl, config)
    .then(async res => {
      httpSpan?.setTag('http.statusCode', res.status);
      httpSpan?.setStatus(spanStatusfromHttpCode(res.status));
      if (!res.ok && res.status !== 400) {
        const unauthorized = [401, 403].includes(res.status);
        if (![401, 403].includes(res.status)) {
          Sentry.captureMessage(`Api request failed`, {
            level: Sentry.Severity.Fatal,
            tags: {
              url,
              'http.status': res.status,
            },
          });
        } else {
          mutate('/restapi/v1/user/status');
        }
        return Promise.reject<RailsApiResponse<null>>({
          ...RailsApiResponseFallback,
          Code: res.status,
          Unauthorized: unauthorized,
        });
      }
      if (options?.responseText) {
        return res.text();
      }
      const json = await res.json();
      Sentry.addBreadcrumb({
        category: 'api',
        type: 'http',
        data: {
          method: 'GET',
          url: getUrl,
          status_code: res.status,
        },
      });
      httpSpan?.setData('Code', json.Code);
      return json;
    })
    .finally(() => httpSpan?.finish());
};

export interface PostOptions {
  formData?: boolean;
  sentryScope?: Transaction | null;
}

export const postApi = <T>(
  url: string,
  body?: {
    [key: string]: number | string | Blob | boolean | undefined | null | object;
  },
  options: PostOptions = {},
): Promise<T> => {
  const config: RequestInit = {
    method: 'post',
    mode: 'cors',
    credentials: 'include',
    headers: new Headers(),
  };
  if (window.user_locale) {
    (config.headers as Headers).append('content-language', window.user_locale);
  }
  if (body) {
    if (options.formData) {
      const formData = new FormData();
      const formBody = cleanPostBody(body);
      for (const key in formBody) {
        if (Array.isArray(formBody[key])) {
          for (const item of formBody[key]) {
            formData.append(key, item as string | Blob);
          }
        } else {
          formData.append(key, formBody[key] as string | Blob);
        }
      }
      config.body = formData;
    } else {
      config.body = JSON.stringify(cleanPostBody(body));
      (config.headers as Headers).append('Content-Type', 'application/json');
    }
  }
  const currentSentryTransaction =
    options.sentryScope || Sentry.getCurrentHub()?.getScope()?.getTransaction();
  const httpSpan = currentSentryTransaction?.startChild({
    op: 'http',
    description: `POST ${url}`,
  });
  const postUrl = url.startsWith('http')
    ? url
    : `${window.__config__.apiUrl}${url}`;
  return fetch(postUrl, config)
    .then(async res => {
      httpSpan?.setTag('http.statusCode', res.status);
      httpSpan?.setStatus(spanStatusfromHttpCode(res.status));
      if (!res.ok && res.status !== 400) {
        const unauthorized = [401, 403].includes(res.status);
        if (!unauthorized) {
          Sentry.captureMessage(`Api request failed`, {
            level: Sentry.Severity.Fatal,
            tags: {
              url,
              'http.status': res.status,
            },
          });
        } else {
          mutate('/restapi/v1/user/status');
        }
        return Promise.reject<RailsApiResponse<null>>({
          ...RailsApiResponseFallback,
          Code: res.status,
          Unauthorized: unauthorized,
        });
      }
      const json = await res.json();
      httpSpan?.setData('Code', json.Code);
      Sentry.addBreadcrumb({
        category: 'api',
        type: 'http',
        data: {
          method: 'POST',
          url: postUrl,
          status_code: res.status,
        },
      });
      return json;
    })
    .finally(() => httpSpan?.finish());
};

export const SwrFetcherConfig: ConfigInterface<
  any,
  any,
  (...args: any) => any
> = {
  fetcher: getApi,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  errorRetryCount: 2,
  dedupingInterval: 30000,
  focusThrottleInterval: 10000,
  errorRetryInterval: 10000,
  onError: (err, key) => {
    if (![401, 403].includes(err.status)) {
      Sentry.captureMessage(
        `Request failed ${key} with status ${err.status}`,
        Sentry.Severity.Fatal,
      );
    }
  },
};

export const formatSuccesfullRailsApiResponse = <T>(
  data: T,
): RailsApiResponse<T> => ({
  Code: 0,
  Data: data,
  Message: '',
  Success: true,
});

export const API_VALIDATIONS = {
  email: async (email: string): Promise<RailsApiResponse<{}>> => {
    const res = await postApi<RailsApiResponse<{}>>(
      '/restapi/v1/registration/check/email',
      {
        email,
      },
    ).catch(err => err);
    return res;
  },
  personalCode: async (
    personal_code: string,
  ): Promise<RailsApiResponse<{}>> => {
    const res = await postApi<RailsApiResponse<{}>>(
      '/restapi/v1/registration/check/personal_code',
      {
        personal_code,
      },
    ).catch((err: RailsApiResponse<{}>) => err);
    return res;
  },
  postalCode: async (
    post_code: string,
  ): Promise<RailsApiResponse<RegistrationPostalCodeAutofill | null>> => {
    const res = await postApi<
      RailsApiResponse<RegistrationPostalCodeAutofill | null>
    >('/restapi/v1/registration/check/post_code', {
      post_code,
    }).catch((err: RailsApiResponse<null>) => err);
    return res;
  },
};
