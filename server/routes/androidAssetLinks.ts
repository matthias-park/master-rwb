import { Request, Response } from 'express';
import { FRANCHISE_CONFIG } from '../constants';

const getAndroidAssetLinks = async (req: Request, res: Response) => {
  const { appLinks } = FRANCHISE_CONFIG;
  if (!appLinks || !appLinks.android) {
    return res.sendStatus(404);
  }

  return res.send(appLinks.android);
};
export default getAndroidAssetLinks;
