import fetch from 'isomorphic-unfetch';
import { ConfigInterface } from 'swr';

const API_URL = window.API_URL;

export const formatUrl = (
  url: string,
  params: { [key: string]: string } = {},
): string => {
  const paramsArr = Object.keys(params)
    .filter(key => params[key])
    .map(key => `${key}=${params[key]}`);
  return `${url}${paramsArr.length ? '?' : ''}${paramsArr.join('&')}`;
};

export const getApi = <T>(url: string): Promise<T> =>
  fetch(`${API_URL}${url}`, {
    mode: 'cors',
    credentials: 'include',
  }).then(res => {
    if (!res.ok) {
      throw new Error(`${url} - ${res.status} ${res.statusText}`);
    }
    return res.json();
  });

export const postApi = <T>(url: string, body?: unknown): Promise<T> => {
  const config: RequestInit = {
    method: 'post',
    mode: 'cors',
    credentials: 'include',
    headers: new Headers(),
  };
  if (body) {
    config.body = JSON.stringify(body);
    (config.headers as Headers).append('Content-Type', 'application/json');
    // (config.headers as Headers).set('User-Agent', 'TonyBetApp');
  }
  return fetch(`${API_URL}${url}`, config).then(res => {
    if (!res.ok) {
      throw new Error(`${url} - ${res.status} ${res.statusText}`);
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
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    console.log(error, `retry count - ${retryCount}`);
  },
};
