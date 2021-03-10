import { NextFunction, Request, Response } from 'express';
import { DOMAINS_TO_FRANCHISE } from '../constants';

const franchiseIdentify = (req: Request, res: Response, next: NextFunction) => {
  const fr = DOMAINS_TO_FRANCHISE[req.hostname];
  if (!fr) {
    return res.sendStatus(404);
  }
  req.franchise = fr;
  next();
};

export default franchiseIdentify;
