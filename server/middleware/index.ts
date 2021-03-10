import useragent from 'express-useragent';
import basicAuth from './basicAuth';
import franchiseIdentify from './franchiseIdentify';
import assetsToFranchise from './assetsToFranchise';
import routeExistCheck from './routeExistCheck';

const middleware = {
  useragent: useragent.express(),
  basicAuth,
  franchiseIdentify,
  assetsToFranchise,
  routeExistCheck,
};

export default middleware;
