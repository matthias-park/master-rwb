module.exports = {
  franchises: {
    bnl: {
      domains: [
        {
          hostname: 'preprod.scooore.be',
          api: 'https://preprod-rapi.scooore.be',
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
    desertDiamond: {
      domains: [
        {
          hostname: 'playdesertdiamond.com',
          api: 'https://feapi.playdesertdiamond.com',
          forceWWW: true,
        },
      ],
      kambi: {
        online: 'https://static.kambicdn.com/client/ddusaz/kambi-bootstrap.js',
        api:
          'https://static.kambicdn.com/client/widget-api/kambi-widget-api.js',
        vaixScript: 'https://desertdiamond-widgets.vaix.ai/bundle.js',
      },
      geoComplyKey: 'lfhhgC74Ve',
      xtremepush: 'https://us.webpu.sh/JM6hjk2KDf4ZBptsyWyjzMox0tiG3CY9/sdk.js',
      componentSettings: {
        v2Auth: 'wss://ws.playdesertdiamond.com',
      },
    },
    gnogaz: {
      domains: [
        {
          hostname: 'az-sports.goldennuggetsports.com',
          api: 'https://az-api.goldennuggetsports.com',
        },
      ],
      sbTechUrl: 'https://az-sports-live.goldennuggetsports.com',
      xtremepush: 'https://us.webpu.sh/6MCTOZTZCr1IsiPan9ce90gdq4Og2mvk/sdk.js',
      gtmId: 'GTM-T6WHQHV',
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
  sentryDsn: 'https://0b31505de86342f49519e9c69599ae28@sentry.tglab.com/9',
};
