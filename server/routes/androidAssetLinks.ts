import { Request, Response } from 'express';

const getAndroidAssetLinks = async (req: Request, res: Response) => {
  const { appLinks } = req.franchise;
  if (!appLinks || !appLinks.android) {
    return res.sendStatus(404);
  }

  return res.send(appLinks.android);
};
export default getAndroidAssetLinks;
