import config from 'config';
import express from 'express';
import auth from 'basic-auth';
import useragent from 'express-useragent';
import fs from 'fs';
import path from 'path';
import { shouldPrerender } from './utils';
import { getRenderedPage } from './ssr';
import {
  BASIC_AUTH,
  DOMAINS_TO_NAME,
  BUILD_FOLDER,
  PRERENDER_HEADER,
} from './constants';

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
  if (req.path.includes('/assets/')) {
    const name = DOMAINS_TO_NAME[req.hostname];
    req.url = req.url.replace('/assets/', `/${name}/`);
  }
  next();
});
app.use(express.static(BUILD_FOLDER));

app.get('*', async (req, res) => {
  if (shouldPrerender(req)) {
    const html = await getRenderedPage(req);
    if (html) {
      return res.send(html);
    }
  }
  const name = DOMAINS_TO_NAME[req.hostname];
  const filePath = path.join(BUILD_FOLDER, `/${name}.html`);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.sendStatus(404);
});

const port = config.get('port') || 3800;
app.listen(port, () => {
  console.log('Server is listening on port ' + port);
});
