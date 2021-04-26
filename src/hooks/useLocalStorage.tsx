import { useState } from 'react';
import Lockr from 'lockr';

export interface Options {
  setInitValue?: boolean;
}

const useLocalStorage = <T extends unknown>(
  key: string,
  initialValue: T,
  options?: Options,
): [value: T, setValue: (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const value = Lockr.get<T>(key);
    if (!value && initialValue && options?.setInitValue) {
      Lockr.set(key, initialValue as any);
    }
    return value || initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    Lockr.set(key, value as any);
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
