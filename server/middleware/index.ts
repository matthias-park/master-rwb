import useragent from 'express-useragent';
import basicAuth from './basicAuth';
import assetsToFranchise from './assetsToFranchise';
import routeExistCheck from './routeExistCheck';
import localeDetect from './localeDetect';

const middleware = {
  useragent: useragent.express(),
  basicAuth,
  assetsToFranchise,
  routeExistCheck,
  localeDetect,
};

export default middleware;
