module.exports = {
  franchises: {
    gnogaz: {
      domains: [
        {
          hostname: 'gnogaz-fe-uat.strivegaming.us',
          api: 'https://gnogazapi-uat.strivegaming.us',
        },
      ],
      sbTechUrl: 'https://gnogaz-fe-uat-sandbox.strivegaming.us',
      xtremepush: 'https://us.webpu.sh/6MCTOZTZCr1IsiPan9ce90gdq4Og2mvk/sdk.js',
      basicAuthEnabled: true,
      componentSettings: {
        v2Auth: 'wss://ws-gnogaz-uat.strivegaming.us',
      },
    },
  },
  redis: {
    host: '192.168.155.41',
    port: 6379,
    db: 12,
    prefix: 'reactNodeTest-',
    password: 'gmRK3vRLvEFejcFnN',
  },
  port: 3800,
};
