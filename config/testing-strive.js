module.exports = {
  franchises: {
    strive: {
      domains: [
        {
          hostname: 'betsafe-fe-test.strivegaming.net',
          api: 'https://feapi-betsafe-test.strivegaming.net',
        },
      ],
      kambi: {
        online:
          'https://cts-static.kambi.com/client/fanusny/kambi-bootstrap.js',
        api:
          'https://cts-static.kambi.com/client/widget-api/kambi-widget-api.js',
      },
      basicAuthEnabled: true,
      componentSettings: {
        v2Auth: 'wss://betsafe-ws-test.strivegaming.net',
      },
    },
  },
  redis: {
    host: '192.168.81.41',
    port: 6379,
    db: 12,
    prefix: 'reactNodeTest-',
    password: 'Vk7Hz9MRvLKmLK8',
  },
  port: 3800,
};
