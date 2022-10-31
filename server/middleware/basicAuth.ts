import { NextFunction, Request, Response } from 'express';
import { BASIC_AUTH, FRANCHISE_CONFIG, LOCALE_REGEX } from '../constants';
import auth from 'basic-auth';
import { getRailsConstants, isReqResourceFile } from '../utils';
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
  if (
    BASIC_AUTH &&
    BASIC_AUTH?.mobileViewExcludedPages &&
    !isReqResourceFile(req)
  ) {
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
          !!BASIC_AUTH?.mobileViewExcludedPages?.[
            FRANCHISE_CONFIG.name
          ]?.includes(route.name),
      )
    ) {
      req.singleLoadPage = true;
      return next();
    }
  }
  if (
    FRANCHISE_CONFIG.excludeBasicAuthFiles?.includes(req.url) ||
    !BASIC_AUTH ||
    !BASIC_AUTH.users ||
    !BASIC_AUTH.whitelistedIp ||
    BASIC_AUTH.whitelistedIp.includes(req.ip) ||
    isReqResourceFile(req)
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
