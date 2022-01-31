const config = require('config');
const { createProxyMiddleware } = require('http-proxy-middleware');
const franchises = Object.values(config.get('franchises'));
const port = config.get('port') || 3800;

const domainToApi = franchises.reduce((obj, fr) => {
  fr.domains.forEach(domain => {
    obj[`${domain.hostname}:${port}`] = domain.api;
  });
  return obj;
}, {});
const domainToName = franchises.reduce((obj, fr) => {
  fr.domains.forEach(domain => {
    obj[domain.hostname] = fr.name;
  });
  return obj;
}, {});

// const proxyDelayRequest = (req, res, next) => {
//   setTimeout(next, 2000);
// };

module.exports = function (app) {
  app.use(
    '/rails/**',
    // proxyDelayRequest,
    createProxyMiddleware({
      target: franchises[0].domains[0].api,
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
