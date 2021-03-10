import { Request, Response, NextFunction } from 'express';

const assetsToFranchise = (req: Request, _: Response, next: NextFunction) => {
  if (req.path.includes('/assets/')) {
    req.url = req.url.replace('/assets/', `/${req.franchise.name}/`);
  }
  next();
};

export default assetsToFranchise;
