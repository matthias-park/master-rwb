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
  })
    .then(r => r.json())
    .catch(err => {
      console.log(err);
      return null;
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
  return fetch(`${API_URL}${url}`, config)
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      return null;
    });
};

export const postRedirectApi = (url: string, body: any = {}): void => {
  var form = document.createElement('form');
  form.method = 'post';
  form.action = url;
  for (const [key, value] of Object.entries(body)) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = key;
    input.value = value as string;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
};

export const SwrFetcherConfig: ConfigInterface<
  any,
  any,
  (...args: any) => any
> = {
  fetcher: getApi,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: true,
  errorRetryInterval: 5000,
  errorRetryCount: 3,
  onError: (err, key) => {
    console.log(`error fething ${key}`);
    console.log(err);
  },
};
