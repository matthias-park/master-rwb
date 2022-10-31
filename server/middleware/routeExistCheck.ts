import { Request, NextFunction, Response } from 'express';
import { matchPath } from 'react-router-dom';
import { LOCALE_REGEX } from '../constants';
import { getRailsConstants, isReqResourceFile } from '../utils';

const routeExistCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isReqResourceFile(req)) return next();
  const railsContants = await getRailsConstants(req);
  if (!railsContants) return next();
  let urlWithoutLocale = req.path.replace(LOCALE_REGEX, '');
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
  if (req.locale && pathInfo?.redirectTo) {
    req.redirectTo = `/${req.locale}${pathInfo.redirectTo}`;
  }
  if (!req.pathExist) {
    res.status(404);
  }
  req.routeData = pathInfo;
  return next();
};

export default routeExistCheck;
