import { useEffect, useMemo, useRef } from 'react';
import { useConfig } from './useConfig';
import { PagesName } from '../constants';
import { useLocation, matchPath } from 'react-router';

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useRoutePath = (
  routeId: PagesName,
  visiblePage = false,
): string => {
  const { routes } = useConfig((prev, next) => !!prev.routes === !!next.routes);
  return useMemo(
    () =>
      routes.find(
        route => route.id === routeId && (!visiblePage || !route.hiddenSitemap),
      )?.path || '/',
    [routes],
  );
};

export const useIsRouteActive = (pathName: string) => {
  const { routes } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );
  const { pathname, hash } = useLocation();
  const pathInfo = useMemo(
    () =>
      routes.find(route => {
        const match = (path: string) =>
          matchPath(path, {
            path: route.path,
            exact: route.exact ?? true,
          });
        return match(`${pathname}${hash}`) || match(`${pathname}`);
      }),
    [routes, pathname, hash],
  );
  return pathInfo?.name === pathName;
};
