module.exports = {
  franchises: {
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
      },
      geoComplyKey: 'lfhhgC74Ve',
      xtremepush: 'https://us.webpu.sh/JM6hjk2KDf4ZBptsyWyjzMox0tiG3CY9/sdk.js',
      redis: {
        host: '192.168.90.40',
        port: 6379,
        db: 12,
        prefix: 'reactNodeProd-',
        password: 'CDVXfY90e4XqO6ZztwH9',
      },
      componentSettings: {
        v2Auth: 'wss://ws.playdesertdiamond.com',
      },
    },
  },
};
