import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { Storage } from '../types/Storage';
import { useConfig } from './useConfig';
import Lockr from 'lockr';

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
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);

  const saveCookies = (cookies: Storage) => {
    if (!cookies.functional) {
      Lockr.rm('locale');
    }
    if (cookies.functional) {
      Lockr.set('locale', locale);
    }
    setStorageCookies(cookies);
  };
  useEffect(() => {
    if (storageCookies === null) saveCookies(defaultCookies);
  }, []);
  return { cookies: storageCookies || defaultCookies, save: saveCookies };
};

export default useStorage;
