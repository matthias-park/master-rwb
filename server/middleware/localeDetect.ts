import { Request, NextFunction, Response } from 'express';
import { LOCALE_REGEX } from '../constants';
import { getRailsConstants, isReqResourceFile } from '../utils';

const localeCookieName = 'user-locale';
const localeDetect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (isReqResourceFile(req) || req.url === '/index.html') return next();
  const railsContants = await getRailsConstants(req);
  if (!railsContants) {
    return next();
  }
  const localeUrlMatch = req.path.match(LOCALE_REGEX)?.[1];
  const availableLocales = railsContants.available_locales.map(
    locale => locale.iso,
  );

  if (railsContants.available_locales.length === 1) {
    req.locale = railsContants.available_locales[0].iso;
  } else if (localeUrlMatch && availableLocales.includes(localeUrlMatch)) {
    req.locale = localeUrlMatch;
  } else if (req.cookies[localeCookieName]) {
    req.locale = req.cookies[localeCookieName];
  } else {
    const acceptsLanguage = req.acceptsLanguages(availableLocales);
    const defaultLocale = railsContants.available_locales.find(
      locale => locale.default,
    );
    if (acceptsLanguage) {
      req.locale = acceptsLanguage;
    } else if (defaultLocale) {
      req.locale = defaultLocale.iso;
    }
  }
  if (req.locale && req.cookies[localeCookieName] !== req.locale) {
    const expires = new Date();
    expires.setFullYear(new Date().getFullYear() + 1);
    res.cookie(localeCookieName, req.locale, {
      domain: req.hostname,
      expires,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
  if (!localeUrlMatch && req.locale && !/^\/api/.test(req.path)) {
    req.redirectTo = `/${req.locale}${req.path}`;
  }
  return next();
};

export default localeDetect;
