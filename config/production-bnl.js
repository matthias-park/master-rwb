module.exports = {
  franchises: {
    bnl: {
      domains: [
        {
          hostname: 'preprod.scooore.be',
          api: 'https://rapi.scooore.be',
          forceWWW: false,
        },
        {
          hostname: 'scooore.be',
          api: 'https://rapi.scooore.be',
          forceWWW: true,
        },
      ],
      gtmId: 'GTM-P7D2MHW',
      kambi: {
        retail: 'https://static.kambicdn.com/client/bnlberl/kambi-bootstrap.js',
        online: 'https://static.kambicdn.com/client/bnlbe/kambi-bootstrap.js',
      },
      redis: {
        host: '192.168.51.45',
        port: 6379,
        db: 12,
        prefix: 'reactNodeProd-',
        password: '06f7wePTnYxIvwdPJESl4b',
      },
    },
  },
};
