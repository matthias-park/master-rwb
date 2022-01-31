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
    },
  },
  port: 3805,
};
