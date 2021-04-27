import fetch from 'isomorphic-unfetch';
import { ConfigInterface } from 'swr';
import { RailsApiResponseFallback } from '../constants';
import RailsApiResponse from '../types/api/RailsApiResponse';

// For rails api testing in dev
// const API_URL = window.API_URL;

export const formatUrl = (
  url: string,
  params: { [key: string]: string | undefined } = {},
): string => {
  const paramsArr = Object.keys(params)
    .filter(key => params[key])
    .map(key => `${key}=${params[key]}`);
  return `${url}${paramsArr.length ? '?' : ''}${paramsArr.join('&')}`;
};

export const getApi = <T>(url: string): Promise<T> => {
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
    return res.json();
  });
};

export interface PostOptions {
  formData?: boolean;
}

export const postApi = <T>(
  url: string,
  body?: { [key: string]: number | string | Blob | boolean },
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
      for (const key in body) {
        formData.append(key, body[key] as string | Blob);
      }
      config.body = formData;
    } else {
      config.body = JSON.stringify(body);
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
};

export const formatSuccesfullRailsApiResponse = <T>(
  data: T,
): RailsApiResponse<T> => ({
  Code: 0,
  Data: data,
  Message: '',
  Success: true,
});
