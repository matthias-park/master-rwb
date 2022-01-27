import config from 'config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import { shouldPrerender } from './utils';
import { getRenderedPage } from './ssr';
import { BUILD_FOLDER, DEVELOPMENT } from './constants';
import logger from './logger';
import middleware from './middleware';
import getRobots from './routes/robots';
import getSitemap from './routes/sitemap';

const app = express();

app.set('trust proxy', true);

app.use(
  helmet.hsts({
    maxAge: 3156000,
    includeSubDomains: true,
    preload: true,
  }),
);
app.use(
  helmet.frameguard({
    action: 'sameorigin',
  }),
);
app.use(helmet.noSniff());
app.use(middleware.useragent);
app.use(middleware.franchiseIdentify);
app.use((req, res, next) => {
  const { url } = req;
  const forceWWW = req.franchise.domains.find(
    domain => domain.hostname === req.hostname.replace('www.', ''),
  )?.forceWWW;
  const wwwRedirect = forceWWW && !req.hostname.match(/^www\..*/i);
  const wwwPrefix = forceWWW && wwwRedirect ? 'www.' : '';
  if ((!req.secure || wwwRedirect) && !DEVELOPMENT) {
    res.redirect(301, `https://${wwwPrefix}${req.hostname}${url}`);
  } else {
    next();
  }
});
app.use(middleware.basicAuth);
app.use(middleware.assetsToFranchise);

app.use('/server/*', (_, res) => {
  return res.sendStatus(404);
});

app.get('/robots.txt', getRobots);

app.get('/sitemap.xml', getSitemap);

app.use(
  express.static(BUILD_FOLDER, {
    maxAge: '30 days',
  }),
);
app.use(middleware.routeExistCheck);
app.get('/api/get-ip', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Content-Type', 'text/plain');
  res.set('Connection', 'close');
  return res.status(200).send(req.ip);
});

app.get('*', async (req, res) => {
  if (shouldPrerender(req)) {
    const renderRes = await getRenderedPage(req);
    if (renderRes.html) {
      return res
        .status(renderRes.status)
        .location(renderRes.path)
        .send(renderRes.html);
    }
  }
  const hostname = req.hostname.replace('www.', '');
  const filePath = path.join(BUILD_FOLDER, `/${hostname}.html`);
  if (fs.existsSync(filePath)) {
    res.set('Cache-Control', 'no-store');
    const userData = JSON.stringify({
      singleLoadPage: req.singleLoadPage,
      ip: req.ip,
      device: req.useragent,
    });
    const body = fs
      .readFileSync(filePath, 'utf-8')
      .replace(
        '<head>',
        `<head><script id="requestData">window.requestData = JSON.parse('${userData}')</script>`,
      );
    return res.send(body);
  }
  logger.error(`file not found ${filePath}`);
  return res.sendStatus(404);
});

const port: number = config.get('port') || 3800;
app.listen(port, '0.0.0.0', () => {
  logger.info(`Server is listening on port ${port}`);
});
