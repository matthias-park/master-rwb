import { useEffect, useMemo, useRef } from 'react';
import { useConfig } from './useConfig';
import { ComponentName } from '../constants';

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useRoutePath = (routeId: ComponentName): string => {
  const { routes } = useConfig();
  return useMemo(
    () => routes.find(route => route.id === routeId)?.path || '/',
    [routes],
  );
};
