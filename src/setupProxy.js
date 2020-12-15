const config = require('config');
const { createProxyMiddleware } = require('http-proxy-middleware');
const franchises = config.get('franchises');
const port = config.get('port') || 3800;

const domainToApi = franchises.reduce((obj, fr) => {
  obj[`${fr.domain}:${port}`] = fr.api;
  return obj;
}, {});

module.exports = function (app) {
  app.use(
    '/rails/**',
    createProxyMiddleware({
      target: franchises[0].api,
      pathRewrite: function (path, req) {
        return path.replace('/rails', '');
      },
      changeOrigin: true,
      router: domainToApi,
    }),
  );
};
