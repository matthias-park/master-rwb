module.exports = {
  franchises: {
    strive: {
      domains: [
        {
          hostname: 'betsafe.strivegaming.net',
          api: 'https://feapi-betsafe.strivegaming.net',
        },
      ],
      basicAuthEnabled: true,
      kambi: {
        online: 'https://c3-static.kambi.com/client/fanusny/kambi-bootstrap.js',
        api:
          'https://c3-static.kambi.com/client/widget-api/kambi-widget-api.js',
      },
      redis: {
        host: '192.168.60.40',
        port: 6379,
        db: 12,
        prefix: 'reactNodeProd-',
        password: 'uZa5MY4Z4fy2L2mDy7R7',
      },
      componentSettings: {
        v2Auth: 'wss://ws-betsafe.strivegaming.net',
      },
    },
  },
};
