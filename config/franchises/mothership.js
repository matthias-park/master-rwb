module.exports = {
  name: 'mothership',
  domains: [
    {
      hostname: 'mothership.local',
      api: 'https://motherhoodus-feapi.tglab.dev',
    },
  ],
  theme: 'strive',
  themeColor: '#000541',
  themeSettings: require('./themeSettings/strive'),
  geoComplyKey: 'ShzolMaAK',
  kambi: {
    market: 'US',
    currency: 'USD',
    online: 'https://ctn-static.kambi.com/client/fanusny/kambi-bootstrap.js',
    api: 'https://ctn-static.kambi.com/client/widget-api/kambi-widget-api.js',
    oddsFormat: 'american',
    enableOddsFormatSelector: true,
    fallbackLocale: 'en_US',
  },
  dateFormat: 'MM-DD-YYYY',
  componentSettings: {
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
