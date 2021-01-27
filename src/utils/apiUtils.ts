import fetch from 'isomorphic-unfetch';
import { ConfigInterface } from 'swr';

// For rails api testing in dev
// const API_URL = window.API_URL;

export const formatUrl = (
  url: string,
  params: { [key: string]: string } = {},
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
  if (window.BASIC_AUTH) {
    (config.headers as Headers).append(
      'Authorization',
      `Basic ${window.BASIC_AUTH}`,
    );
  }
  return fetch(`${window.API_URL}${url}`, config).then(res => {
    if (!res.ok) {
      throw new Error(`${url} - ${res.status} ${res.statusText}`);
    }
    return res.json();
  });
};

export interface PostOptions {
  formData?: boolean;
}

export const postApi = <T>(
  url: string,
  body?: { [key: string]: string | Blob },
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
      console.log(body);
      const formData = new FormData();
      for (const key in body) {
        formData.append(key, body[key]);
      }
      config.body = formData;
    } else {
      config.body = JSON.stringify(body);
      (config.headers as Headers).append('Content-Type', 'application/json');
    }
  }
  if (window.BASIC_AUTH) {
    (config.headers as Headers).append(
      'Authorization',
      `Basic ${window.BASIC_AUTH}`,
    );
  }
  const postUrl = url.startsWith('http') ? url : `${window.API_URL}${url}`;
  return fetch(postUrl, config).then(res => {
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
