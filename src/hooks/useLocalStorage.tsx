import { useState } from 'react';
import Lockr from 'lockr';

const useLocalStorage = (
  key: string,
  initialValue: unknown,
): [value: unknown, setValue: (value: string | number | Object) => void] => {
  const [storedValue, setStoredValue] = useState(Lockr.get(key, initialValue));
  const setValue = (value: string | number | Object) => {
    setStoredValue(value);
    Lockr.set(key, value);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
