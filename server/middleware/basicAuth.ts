import { NextFunction, Request, Response } from 'express';
import { PRERENDER_HEADER, BASIC_AUTH } from '../constants';
import auth from 'basic-auth';

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.header(PRERENDER_HEADER) ||
    !BASIC_AUTH ||
    !BASIC_AUTH.users ||
    !BASIC_AUTH.whitelistedIp ||
    BASIC_AUTH.whitelistedIp.includes(req.ip)
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
