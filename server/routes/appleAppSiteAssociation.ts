import { Request, Response } from 'express';
import { FRANCHISE_CONFIG } from '../constants';

const getAppleAppSiteAssociation = async (req: Request, res: Response) => {
  const { appLinks } = FRANCHISE_CONFIG;
  if (!appLinks || !appLinks.apple) {
    return res.sendStatus(404);
  }

  return res.send(appLinks.apple);
};
export default getAppleAppSiteAssociation;
