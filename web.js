const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', proxy('https://bnl-dev.tglab.dev'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

const port = process.env.PORT || 4800;
app.listen(port, err => {
  if (err) {
    return console.log(err);
  }
  console.log('Server is listening on port ' + port);
});
