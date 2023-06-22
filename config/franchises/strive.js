module.exports = {
  name: 'strive',
  domains: [
    {
      hostname: 'strive.local',
      api: 'https://strive-dev.tglab.dev',
    },
  ],
  theme: 'strive',
  themeColor: '#000541',
  themeSettings: require('./themeSettings/strive'),
  geoComplyKey: 'ShzolMaAK',
  smartyStreets: '108064519358658502',
  kambi: {
    market: 'US',
    currency: 'USD',
    online: 'https://ctn-static.kambi.com/client/fanusny/kambi-bootstrap.js',
    api: 'https://ctn-static.kambi.com/client/widget-api/kambi-widget-api.js',
    oddsFormat: 'american',
    enableOddsFormatSelector: true,
    fallbackLocale: 'en_US',
  },
  xtremepush: 'https://prod.webpu.sh/xIPqGJt6fuQgTzDOSuSTN72PPi7rRk6F/sdk.js',
  dateFormat: 'MM-DD-YYYY',
  componentSettings: {
    v2Auth: 'wss://strive-ws.tglab.dev',
    userIdleTimeout: 30,
    login: {
      loginCookiesAccept: true,
    },
    modals: {
      TnC: true,
      ResponsibleGambling: false,
      ValidationFailed: true,
      CookiePolicy: true,
      AddBankAccount: true,
      GeoComply: true,
      PlayerDisabled: true,
    },
  },
  geoComply: {
    checkOnLogin: true,
  },
};
