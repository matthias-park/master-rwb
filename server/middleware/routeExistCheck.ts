import { Request, NextFunction, Response } from 'express';
import { matchPath } from 'react-router-dom';
import { getRailsConstants } from '../utils';

const routeExistCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const railsContants = await getRailsConstants(req);
  if (!railsContants) return next();
  const localeUrlMatch = req.url.match(/^\/([a-z]{2}-[a-z]{2}|[a-z]{2})\//i);
  const locale = localeUrlMatch?.[1];
  const urlWithoutLocale = req.url.replace(`/${locale}/`, '/');
  if (
    railsContants.navigation_routes.some(route =>
      matchPath(urlWithoutLocale, {
        path: route.path,
        exact: route.exact ?? true,
      }),
    )
  ) {
    return next();
  }
  res.status(404);
  return next();
};

export default routeExistCheck;
