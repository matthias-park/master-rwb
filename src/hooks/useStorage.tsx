import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { Storage } from '../types/Storage';

const defaultCookies: Storage = {
  functional: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

const useStorage = () => {
  const [storageCookies, setStorageCookies] = useLocalStorage<Storage | null>(
    'cookieSettings',
    null,
  );

  const saveCookies = (cookies: Storage) => {
    setStorageCookies(cookies);
  };
  useEffect(() => {
    if (storageCookies === null) saveCookies(defaultCookies);
  }, []);
  return {
    cookies: storageCookies || defaultCookies,
    saveCookies: saveCookies,
  };
};

export default useStorage;
