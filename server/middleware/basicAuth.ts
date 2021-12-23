import { NextFunction, Request, Response } from 'express';
import {
  PRERENDER_HEADER,
  BASIC_AUTH,
  LOCALE_REGEX,
  extensionsToIgnore,
} from '../constants';
import auth from 'basic-auth';
import { getRailsConstants } from '../utils';
import { matchPath } from 'react-router-dom';

const basicAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.franchise.domains.some(domain =>
      req
        .header('referer')
        ?.includes(
          `${domain.hostname}/service-worker.js?name=${req.franchise.name}`,
        ),
    )
  )
    return next();
  if (BASIC_AUTH && BASIC_AUTH?.mobileViewExcludedPages) {
    const railsConstants = await getRailsConstants(req);
    let urlWithoutLocale = req.path.replace(LOCALE_REGEX, '');
    if (!urlWithoutLocale.startsWith('/'))
      urlWithoutLocale = `/${urlWithoutLocale}`;
    if (
      railsConstants?.navigation_routes.some(
        route =>
          !!matchPath(urlWithoutLocale, {
            path: route.path,
            exact: route.exact ?? true,
          }) &&
          !!BASIC_AUTH?.mobileViewExcludedPages?.[req.franchise.name]?.includes(
            route.name,
          ),
      )
    ) {
      req.singleLoadPage = true;
      return next();
    }
  }
  if (
    !req.franchise.basicAuthEnabled ||
    req.franchise.excludeBasicAuthFiles?.includes(req.url) ||
    req.header(PRERENDER_HEADER) ||
    !BASIC_AUTH ||
    !BASIC_AUTH.users ||
    !BASIC_AUTH.whitelistedIp ||
    BASIC_AUTH.whitelistedIp.includes(req.ip) ||
    extensionsToIgnore.some(
      extension => req.url.toLowerCase().indexOf(extension) !== -1,
    )
  ) {
    return next();
  }
  const authentication = auth(req);
  const unauthorized = () => {
    if (!authentication) {
      const challengeString = 'Basic realm="Application"';
      res.set('WWW-Authenticate', challengeString);
    }
    return res.status(401).send('Unauthorized!');
  };
  if (!authentication) {
    return unauthorized();
  }
  for (var user of BASIC_AUTH.users) {
    if (
      authentication.name === user.username &&
      authentication.pass === user.password
    ) {
      return next();
    }
  }
  return unauthorized();
};
export default basicAuth;
