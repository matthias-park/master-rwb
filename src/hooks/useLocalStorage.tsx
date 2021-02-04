import { useState } from 'react';
import Lockr from 'lockr';

const useLocalStorage = <T extends unknown>(
  key: string,
  initialValue: T,
): [value: T, setValue: (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(
    Lockr.get<T>(key, initialValue),
  );
  const setValue = (value: T) => {
    setStoredValue(value);
    Lockr.set(key, value as any);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
