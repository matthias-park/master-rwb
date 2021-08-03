import { Request, NextFunction, Response } from 'express';
import { matchPath } from 'react-router-dom';
import { getRailsConstants } from '../utils';

const LOCALE_REGEX = /^\/([a-z]{2}-[a-z]{2}|[a-z]{2})(\/|$)/i;
const routeExistCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const railsContants = await getRailsConstants(req);
  if (!railsContants) return next();
  const localeUrlMatch = req.url.match(LOCALE_REGEX);
  req.locale = localeUrlMatch?.[1];
  if (!req.locale && railsContants.available_locales.length === 1) {
    req.locale = railsContants.available_locales[0].iso;
  }
  let urlWithoutLocale = req.url.replace(LOCALE_REGEX, '');
  if (!urlWithoutLocale.startsWith('/'))
    urlWithoutLocale = `/${urlWithoutLocale}`;
  const pathInfo = railsContants.navigation_routes.find(route =>
    matchPath(urlWithoutLocale, {
      path: route.path,
      exact: route.exact ?? true,
    }),
  );
  req.pathExist = !!pathInfo;
  if (pathInfo?.id === 20 && req.locale) {
    req.pathExist = false;
  }
  req.redirectTo = pathInfo?.redirectTo;
  if (!req.pathExist) {
    res.status(404);
  }
  return next();
};

export default routeExistCheck;
