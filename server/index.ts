import config from 'config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {
  formatHtmlResponse,
  getRailsConstants,
  isReqResourceFile,
} from './utils';
import { BUILD_FOLDER, DEVELOPMENT, FRANCHISE_CONFIG } from './constants';
import logger from './logger';
import middleware from './middleware';
import getRobots from './routes/robots';
import getSitemap from './routes/sitemap';
import expressStaticGzip from 'express-static-gzip';
import compression from 'compression';
import getAndroidAssetLinks from './routes/androidAssetLinks';
import getAppleAppSiteAssociation from './routes/appleAppSiteAssociation';

const port: number = config.get('port') || 3800;
const app = express();

app.set('trust proxy', true);
app.use(function (req, res, next) {
  res.removeHeader('x-powered-by');
  res.removeHeader('server');
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use(
  helmet.hsts({
    maxAge: 3156000,
    includeSubDomains: true,
    preload: true,
  }),
);
app.use(
  helmet.referrerPolicy({
    policy: 'no-referrer',
  }),
);
app.use(helmet.noSniff());
app.use(middleware.useragent);
app.use((req, res, next) => {
  const { url } = req;
  const { forceWWW } =
    FRANCHISE_CONFIG.domains.find(domain =>
      req.hostname.includes(domain.hostname),
    ) || {};
  const wwwRedirect = forceWWW && !req.hostname.match(/^www\..*/i);
  const wwwPrefix = forceWWW && wwwRedirect ? 'www.' : '';
  if ((!req.secure || wwwRedirect) && !DEVELOPMENT) {
    res.redirect(301, `https://${wwwPrefix}${req.hostname}${url}`);
  } else {
    next();
  }
});

app.use(middleware.assetsToFranchise);
app.use((req, res, next) => {
  if (req.path === '/index.html') {
    return next();
  }
  expressStaticGzip(BUILD_FOLDER, {
    enableBrotli: true,
    index: false,
    orderPreference: ['br'],
    serveStatic: {
      maxAge: '30 days',
    },
  })(req, res, next);
});
if (FRANCHISE_CONFIG.basicAuthEnabled) {
  app.use(middleware.basicAuth);
}

app.use('/server/*', (_, res) => {
  return res.sendStatus(404);
});
app.use(middleware.localeDetect);

app.get('/robots.txt', getRobots);
app.get('/sitemap.xml', getSitemap);
app.get('/.well-known/apple-app-site-association', getAppleAppSiteAssociation);
app.get('/.well-known/assetlinks.json', getAndroidAssetLinks);

app.use(middleware.routeExistCheck);
app.get('/api/get-ip', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Content-Type', 'text/plain');
  res.set('Connection', 'close');
  return res.status(200).send(req.ip);
});
app.post('/api/set-locale', async (req, res) => {
  const newLocale = req.body.locale;
  const railsContants = await getRailsConstants(req);
  if (!railsContants) {
    return res.sendStatus(500);
  }
  const newLocaleAvailable = railsContants.available_locales.some(
    locale => locale.iso === newLocale,
  );
  if (!newLocaleAvailable) {
    return res.sendStatus(401);
  }
  const expires = new Date();
  expires.setFullYear(new Date().getFullYear() + 1);
  res.cookie('user-locale', newLocale, {
    domain: req.hostname,
    expires,
    httpOnly: true,
  });
  return res.status(200).json({ success: true });
});

app.use(compression());

app.get('*', async (req, res) => {
  if (req.path === '/index.html') {
    res.status(200);
    delete req.redirectTo;
  } else if (isReqResourceFile(req)) return res.sendStatus(404);
  if (req.redirectTo && req.path !== req.redirectTo) {
    const query = Object.keys(req.query).length
      ? `?${Object.entries(req.query)
          .map(entry => `${entry[0]}=${entry[1]}`)
          .join('&')}`
      : '';
    return res.redirect(`${req.redirectTo}${query}`);
  }
  if (!req.locale) {
    const railsContants = await getRailsConstants(req);
    const localeSelectRoute = railsContants?.navigation_routes.find(
      route => route.id === 20,
    )?.path;
    if (localeSelectRoute && req.path !== localeSelectRoute) {
      return res.redirect(localeSelectRoute);
    }
  }
  res.set('Cache-Control', 'no-store');
  const html = await formatHtmlResponse(req);
  if (!html) {
    return res.sendStatus(404);
  }
  return res.send(html);
});

app.listen(port, '0.0.0.0', () => {
  logger.info(`Server is listening on port ${port}`);
});
