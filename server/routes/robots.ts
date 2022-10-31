import { Request, Response } from 'express';
import { FRANCHISE_API_DOMAIN } from '../constants';
import logger from '../logger';

const getRobots = async (req: Request, res: Response) => {
  return fetch(`${FRANCHISE_API_DOMAIN}/robots.txt`)
    .then(async result => {
      const text = await result.text();
      return res.status(result.status).type('text/plain').send(text);
    })
    .catch(err => {
      logger.error(err);
      return res.status(500);
    });
};
export default getRobots;
