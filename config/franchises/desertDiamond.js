module.exports = {
  name: 'desertDiamond',
  domains: [
    {
      hostname: 'pdd.local',
      api: 'https://ddmapi-dev.strivegaming.us',
    },
  ],
  theme: 'strive',
  dateFormat: 'MM-DD-YYYY',
  kambi: {
    market: 'US',
    currency: 'USD',
    online: 'https://ctn-static.kambi.com/client/ddusaz/kambi-bootstrap.js',
    api: 'https://ctn-static.kambi.com/client/widget-api/kambi-widget-api.js',
    oddsFormat: 'american',
    fallbackLocale: 'en_US',
    vaixScript: 'https://staging-desertdiamond-widgets.vaix.ai/bundle.js',
  },
  gtmId: 'GTM-KBCKVS5',
  geoComplyKey: 'ShzolMaAK',
  smartyStreets: '108064515683753034',
  xtremepush: 'https://us.webpu.sh/8UCYTGU9kjyxCCgQtCqROPz24HI_2FvA/sdk.js',
  zendesk: '35d43606-f8bf-4f03-8b8b-6aa6b7690498',
  fbDomainVerification: 'o66579dq5m385gvckustltakqw3xp5',
  themeSettings: require('./themeSettings/desertDiamond'),
  componentSettings: {
    userIdleTimeout: 30,
    v2Auth: 'wss://ddm-wsdev.strivegaming.us',
    useBalancesEndpoint: true,
    login: {
      loginCookiesAccept: true,
      emailLogin: true,
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
    header: {
      needsBurger: true,
    },
  },
};
