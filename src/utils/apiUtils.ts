import { API_URL } from '../constants';
import fetch from 'isomorphic-unfetch';

export const formatUrl = (
  url: string,
  params: { [key: string]: string },
): string => {
  const paramsArr = Object.keys(params)
    .filter(key => params[key])
    .map(key => `${key}=${params[key]}`);
  return `${url}?${paramsArr.join('&')}`;
};

export const getApi = <T>(url: string): Promise<T> =>
  fetch(`${API_URL}${url}`)
    .then(r => r.json())
    .catch(err => {
      console.log(err);
      return null;
    });

export const postApi = <T>(url: string, body?: unknown): Promise<T> => {
  const config: RequestInit = {
    method: 'post',
    headers: new Headers(),
  };
  if (body) {
    config.body = JSON.stringify(body);
    (config.headers as Headers).append('Content-Type', 'application/json');
  }
  return fetch(`${API_URL}${url}`, config)
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      return null;
    });
};
