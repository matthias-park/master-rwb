import fetch from 'isomorphic-unfetch';
import { ConfigInterface } from 'swr';
import { RailsApiResponseFallback } from '../constants';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { RegistrationPostalCodeAutofill } from '../types/api/user/Registration';
import { cleanPostBody } from '.';
// For rails api testing in dev
// const API_URL = window.API_URL;

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
}

export const getApi = <T>(url: string, options?: GetApiOptions): Promise<T> => {
  const config: RequestInit = {
    mode: 'cors',
    credentials: 'include',
    headers: new Headers(),
  };
  return fetch(`${window.__config__.apiUrl}${url}`, config).then(res => {
    if (!res.ok && res.status !== 400) {
      return Promise.reject<RailsApiResponse<null>>({
        ...RailsApiResponseFallback,
        Code: res.status,
      });
    }
    if (options?.responseText) {
      return res.text();
    }
    return res.json();
  });
};

export interface PostOptions {
  formData?: boolean;
}

export const postApi = <T>(
  url: string,
  body?: { [key: string]: number | string | Blob | boolean | undefined | null },
  options: PostOptions = {},
): Promise<T> => {
  const config: RequestInit = {
    method: 'post',
    mode: 'cors',
    credentials: 'include',
    headers: new Headers(),
  };
  if (body) {
    if (options.formData) {
      const formData = new FormData();
      const formBody = cleanPostBody(body);
      for (const key in formBody) {
        formData.append(key, formBody[key] as string | Blob);
      }
      config.body = formData;
    } else {
      config.body = JSON.stringify(cleanPostBody(body));
      (config.headers as Headers).append('Content-Type', 'application/json');
    }
  }
  const postUrl = url.startsWith('http')
    ? url
    : `${window.__config__.apiUrl}${url}`;
  return fetch(postUrl, config).then(res => {
    if (!res.ok && res.status !== 400) {
      return Promise.reject<RailsApiResponse<null>>({
        ...RailsApiResponseFallback,
        Code: res.status,
      });
    }
    return res.json();
  });
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
