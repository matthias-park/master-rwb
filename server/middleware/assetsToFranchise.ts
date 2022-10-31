import { Request, Response, NextFunction } from 'express';
import { FRANCHISE_CONFIG } from '../constants';

const assetsToFranchise = (req: Request, _: Response, next: NextFunction) => {
  if (req.path.includes('/assets/')) {
    req.url = req.url.replace('/assets/', `/${FRANCHISE_CONFIG.name}/`);
  }
  next();
};

export default assetsToFranchise;
