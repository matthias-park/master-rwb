import { Request, NextFunction, Response } from 'express';
import { getRailsConstants } from '../utils';
// import { ALL_LOCALES_ISO } from '../constants';

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
    railsContants.navigation_routes.some(
      route => route.path === urlWithoutLocale,
    )
  ) {
    return next();
  }
  res.status(404);
  return next();
};

export default routeExistCheck;
