module.exports = {
  franchises: {
    gnogaz: {
      basicAuthEnabled: true,
      domains: [
        {
          hostname: 'az-sports.goldennuggetsports.com',
          api: 'https://az-api.goldennuggetsports.com',
        },
      ],
      sbTechUrl: 'https://az-sports-live.goldennuggetsports.com',
      xtremepush: 'https://us.webpu.sh/6MCTOZTZCr1IsiPan9ce90gdq4Og2mvk/sdk.js',
      redis: {
        host: '192.168.150.40',
        port: 6379,
        db: 12,
        prefix: 'reactNodeProd-',
        password: 'Y9pxykZ69RW4t98SQxUqL',
      },
      componentSettings: {
        v2Auth: 'wss://az-ws.goldennuggetsports.com',
      },
    },
  },
};
