const config = require('config');
const express = require('express');
const path = require('path');

const app = express();

const domainsToName = config.get('franchises').reduce((obj, fr) => {
  obj[fr.domain] = fr.name;
  return obj;
}, {});

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
  res.sendFile(path.join(__dirname, `/build/${name}.html`));
});

const port = config.get('port') || 3800;
app.listen(port, err => {
  if (err) {
    return console.log(err);
  }
  console.log('Server is listening on port ' + port);
});
