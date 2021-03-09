import config from 'config';
import express from 'express';
import auth from 'basic-auth';
import useragent, { reset } from 'express-useragent';
import fs from 'fs';
import path from 'path';
import { shouldPrerender, getCache } from './utils';
import { getRenderedPage } from './ssr';
import { DOMAINS_TO_FRANCHISE, FranchiseConfig } from './constants';
import fetch from 'isomorphic-unfetch';
import { PageConfig } from '../src/types/api/PageConfig';
import { BASIC_AUTH, BUILD_FOLDER, PRERENDER_HEADER } from './constants';
import { PagesName } from '../src/constants';
import RailsApiResponse from '../src/types/api/RailsApiResponse';

declare global {
  namespace Express {
    interface Request {
      franchise: FranchiseConfig;
    }
  }
}

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
app.use((req, _, next) => {
  const fr = DOMAINS_TO_FRANCHISE[req.hostname];
  req.franchise = fr;
  next();
});

app.use('/robots.txt', async (req, res) => {
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
app.use((req, _, next) => {
  if (req.path.includes('/assets/')) {
    req.url = req.url.replace('/assets/', `/${req.franchise.name}/`);
  }
  next();
});
app.use(express.static(BUILD_FOLDER));

app.use(async (req, res, next) => {
  // 2 hour cache
  const railsContants = await getCache<PageConfig | null>(
    `${req.franchise.name}-rails-constants`,
    7200000,
    () =>
      fetch(`${req.franchise.api}/railsapi/v1/content/constants`).then(
        async res => {
          if (res.ok) {
            const data: RailsApiResponse<PageConfig> = await res.json();
            const navigation_routes = data.Data.navigation_routes.filter(
              route =>
                route.id !== PagesName.NotFoundPage && route.path !== '*',
            );
            return {
              ...data.Data,
              navigation_routes,
            };
          }
          return null;
        },
      ),
  );
  if (!railsContants) return next();
  const urlWithoutLocale = req.url.replace(
    new RegExp(
      `^/${railsContants.available_locales.map(lang => lang.iso).join('|')}`,
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
