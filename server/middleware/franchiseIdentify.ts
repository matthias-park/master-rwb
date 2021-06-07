import { NextFunction, Request, Response } from 'express';
import { DOMAINS_TO_FRANCHISE } from '../constants';

const franchiseIdentify = (req: Request, res: Response, next: NextFunction) => {
  const hostname = req.hostname.replace('www.', '');
  const fr = DOMAINS_TO_FRANCHISE[hostname];
  if (!fr) {
    return res.sendStatus(404);
  }
  req.franchise = fr;
  next();
};

export default franchiseIdentify;
