import { useEffect, useMemo, useRef } from 'react';
import { useConfig } from './useConfig';
import { PagesName } from '../constants';

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useRoutePath = (routeId: PagesName): string => {
  const { routes } = useConfig((prev, next) => !!prev.routes === !!next.routes);
  return useMemo(
    () => routes.find(route => route.id === routeId)?.path || '/',
    [routes],
  );
};
