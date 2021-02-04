import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { Storage } from '../types/Storage';
import { useConfig } from './useConfig';
import Lockr from 'lockr';

const defaultCookies: Storage = {
  essential: true,
  functional: true,
  thirdParty: true,
};

const useStorage = () => {
  const [storageCookies, setStorageCookies] = useLocalStorage<Storage | null>(
    'cookieSettings',
    null,
  );
  const config = useConfig();

  const saveCookies = (cookies: Storage) => {
    if (!cookies.functional) {
      Lockr.rm('locale');
    }
    if (cookies.functional) {
      Lockr.set('locale', config.locale);
    }
    setStorageCookies(cookies);
  };
  useEffect(() => {
    if (storageCookies === null) saveCookies(defaultCookies);
  }, []);
  return { cookies: storageCookies || defaultCookies, save: saveCookies };
};

export default useStorage;
