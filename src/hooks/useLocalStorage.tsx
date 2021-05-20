import { useEffect, useState } from 'react';
import Lockr from 'lockr';

export interface Options {
  setInitValue?: boolean;
  valueAs?: (value: any) => any;
}

const useLocalStorage = <T extends unknown>(
  key: string,
  initialValue: T,
  options?: Options,
): [value: T, setValue: (value: T) => void] => {
  const getValue = () => {
    const value = Lockr.get<T>(key);
    if (!value && initialValue && options?.setInitValue) {
      Lockr.set(key, initialValue as any);
    }
    return value || initialValue;
  };
  const [storedValue, setStoredValue] = useState<T>(getValue);

  useEffect(() => {
    setStoredValue(getValue());
  }, [key]);

  const setValue = (value: T) => {
    setStoredValue(value);
    Lockr.set(key, value as any);
  };
  const returnedValue = options?.valueAs
    ? options.valueAs(storedValue)
    : storedValue;
  return [returnedValue, setValue];
};

export default useLocalStorage;
