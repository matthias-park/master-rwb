const config = require('config');
const express = require('express');
const path = require('path');
const auth = require('basic-auth');
const fs = require('fs');

const app = express();

const domainsToName = config.get('franchises').reduce((obj, fr) => {
  obj[fr.domain] = fr.name;
  return obj;
}, {});
const basicAuth = config.has('basicAuth') && config.get('basicAuth');

app.set('trust proxy', true);

app.use((req, res, next) => {
  if (
    !basicAuth ||
    !basicAuth.users ||
    !basicAuth.whitelistedIp ||
    basicAuth.whitelistedIp.includes(req.ip)
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
  for (var i in basicAuth.users) {
    if (
      authentication.name === i &&
      authentication.pass === basicAuth.users[i]
    ) {
      req.auth = authentication;
      return next();
    }
  }
  return unauthorized();
});

app.use((req, _, next) => {
  if (req.path.includes('/assets/')) {
    const name = domainsToName[req.hostname];
    req.url = req.url.replace('/assets/', `/${name}/`);
  }
  next();
});
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  const name = domainsToName[req.hostname];
  const filePath = path.join(__dirname, `/build/${name}.html`);
  res.sendFile(filePath);
});

const port = config.get('port') || 3800;
app.listen(port, err => {
  if (err) {
    return console.log(err);
  }
  console.log('Server is listening on port ' + port);
});
