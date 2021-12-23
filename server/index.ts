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
    if (req.singleLoadPage) {
      const body = fs
        .readFileSync(filePath, 'utf-8')
        .replace(
          '</head>',
          '<script>window.singleLoadPage = true;</script></head>',
        );
      return res.send(body);
    }
    return res.sendFile(filePath);
  }
  logger.error(`file not found ${filePath}`);
  return res.sendStatus(404);
});

const port: number = config.get('port') || 3800;
app.listen(port, '0.0.0.0', () => {
  logger.info(`Server is listening on port ${port}`);
});
