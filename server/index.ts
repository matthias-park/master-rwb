import config from 'config';
import express from 'express';
import auth from 'basic-auth';
import useragent, { reset } from 'express-useragent';
import fs from 'fs';
import path from 'path';
import { shouldPrerender, getRailsConstants } from './utils';
import { getRenderedPage } from './ssr';
import { DOMAINS_TO_FRANCHISE, DEVELOPMENT } from './constants';
import fetch from 'isomorphic-unfetch';
import { BASIC_AUTH, BUILD_FOLDER, PRERENDER_HEADER } from './constants';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const app = express();

app.set('trust proxy', true);
app.use(useragent.express());
app.use((req, res, next) => {
  if (
    req.header(PRERENDER_HEADER) ||
    !BASIC_AUTH ||
    !BASIC_AUTH.users ||
    !BASIC_AUTH.whitelistedIp ||
    BASIC_AUTH.whitelistedIp.includes(req.ip)
  ) {
    return next();
  }
  const authentication = auth(req);
  const unauthorized = () => {
    if (!authentication) {
      const challengeString = 'Basic realm="Application"';
      res.set('WWW-Authenticate', challengeString);
    }
    return res.status(401).send('Unauthorized!');
  };
  if (!authentication) {
    return unauthorized();
  }
  for (var user of BASIC_AUTH.users) {
    if (
      authentication.name === user.username &&
      authentication.pass === user.password
    ) {
      return next();
    }
  }
  return unauthorized();
});
app.use('/server/*.js', (_, res) => {
  return res.sendStatus(404);
});
app.use((req, res, next) => {
  const fr = DOMAINS_TO_FRANCHISE[req.hostname];
  if (!fr) {
    return res.sendStatus(404);
  }
  req.franchise = fr;
  next();
});

app.get('/robots.txt', async (req, res) => {
  return fetch(`${req.franchise.api}/robots.txt`)
    .then(async result => {
      const text = await result.text();
      return res.status(result.status).type('text/plain').send(text);
    })
    .catch(err => {
      console.log(err);
      return res.status(500);
    });
});

app.get('/sitemap.xml', async (req, res) => {
  const railsContants = await getRailsConstants(req);
  const nowDate = new Date();
  const links = railsContants?.navigation_routes
    ?.map(
      route =>
        !route.hiddenSitemap &&
        !route.protected && {
          url: route.path,
          changefreq: 'weekly',
          priority: 0.5,
          lastmod: nowDate,
        },
    )
    .filter(Boolean);
  if (!links) return res.sendStatus(404);
  const hostname = DEVELOPMENT
    ? `http://${req.franchise.domain}`
    : req.franchise.domain;
  const stream = new SitemapStream({
    hostname: hostname,
    lastmodDateOnly: true,
  });
  Readable.from(links).pipe(stream);
  res.header('Content-Type', 'application/xml');
  return stream.pipe(res).on('error', e => {
    console.log(e);
  });
});

app.use((req, _, next) => {
  if (req.path.includes('/assets/')) {
    req.url = req.url.replace('/assets/', `/${req.franchise.name}/`);
  }
  next();
});
app.use(express.static(BUILD_FOLDER));

app.use(async (req, res, next) => {
  const railsContants = await getRailsConstants(req);
  if (!railsContants) return next();
  const urlWithoutLocale = req.url.replace(
    new RegExp(
      `^/(${railsContants.available_locales.map(lang => lang.iso).join('|')})`,
      'g',
    ),
    '',
  );
  if (
    railsContants.navigation_routes.some(
      route => route.path === urlWithoutLocale,
    )
  ) {
    return next();
  }
  res.status(404);
  return next();
});

app.get('*', async (req, res) => {
  if (shouldPrerender(req)) {
    const html = await getRenderedPage(req);
    if (html) {
      return res.send(html);
    }
  }
  const filePath = path.join(BUILD_FOLDER, `/${req.franchise.name}.html`);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.sendStatus(404);
});

const port = config.get('port') || 3800;
app.listen(port, () => {
  console.log('Server is listening on port ' + port);
});
