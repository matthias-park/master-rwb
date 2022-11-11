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
  return useMemo(() => {
    const route = routes.find(
      route => route.id === routeId && (!visiblePage || !route.hiddenSitemap),
    );
    return route?.redirectTo || route?.path || '/';
  }, [routes]);
};

export const useIsRouteActive = (
  props: string | { path?: string; id?: PagesName },
) => {
  const currentPath = useCurrentRoute();
  if (!currentPath) return false;
  if (typeof props === 'object') {
    return currentPath.id === props.id || currentPath.path === props.path;
  }
  if (typeof props === 'string') {
    return currentPath.name === props;
  }
  return false;
};

export const useCurrentRoute = () => {
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
  return pathInfo;
};
