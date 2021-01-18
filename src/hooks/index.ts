import { useEffect, useMemo, useRef } from 'react';
import { useConfig } from './useConfig';
import { ComponentName } from '../constants';

export const usePrevious = (value: unknown) => {
  const ref = useRef<unknown>();

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
