module.exports = {
  franchises: {
    bnl: {
      domains: [
        {
          hostname: 'bnl-rjtest.tglab.dev',
          api: 'https://bnl-test-rails.tglab.dev',
          forceWWW: false,
        },
        {
          hostname: 'uat-fe.scooore.be',
          api: 'https://uat-api.scooore.be',
          forceWWW: false,
        },
      ],
      basicAuthEnabled: true,
      redis: {
        prefix: 'reactNodeTest-',
      },
      kambi: {
        retail:
          'https://cts-static.kambi.com/client/bnlberl/kambi-bootstrap.js',
        online: 'https://cts-static.kambi.com/client/bnlbe/kambi-bootstrap.js',
        api:
          'https://cts-static.kambi.com/client/widget-api/kambi-widget-api.js',
      },
    },
  },
  port: 3805,
};
