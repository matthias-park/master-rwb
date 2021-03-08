const config = require('config');
const { createProxyMiddleware } = require('http-proxy-middleware');
const franchises = config.get('franchises');
const port = config.get('port') || 3800;

const domainToApi = franchises.reduce((obj, fr) => {
  obj[`${fr.domain}:${port}`] = fr.api;
  return obj;
}, {});
const domainToName = franchises.reduce((obj, fr) => {
  obj[fr.domain] = fr.name;
  return obj;
}, {});

const proxyDelayRequest = (req, res, next) => {
  setTimeout(next, 2000);
};

module.exports = function (app) {
  app.use(
    '/rails/**',
    proxyDelayRequest,
    createProxyMiddleware({
      target: franchises[0].api,
      pathRewrite: function (path, req) {
        return path.replace('/rails', '');
      },
      changeOrigin: true,
      router: domainToApi,
      cookieDomainRewrite: '',
      secure: false,
      rejectUnauthorized: false,
    }),
  );
  app.use(
    '/assets/**',
    createProxyMiddleware({
      target: `http://localhost:${port}`,
      pathRewrite: function (path, req) {
        return path.replace('/assets/', `/${domainToName[req.hostname]}/`);
      },
      changeOrigin: true,
    }),
  );
};
