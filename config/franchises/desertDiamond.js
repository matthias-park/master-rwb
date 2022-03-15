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
  },
  geoComplyKey: 'ShzolMaAK',
  smartyStreets: '108064515683753034',
  xtremepush: 'https://us.webpu.sh/8UCYTGU9kjyxCCgQtCqROPz24HI_2FvA/sdk.js',
  zendesk: '35d43606-f8bf-4f03-8b8b-6aa6b7690498',
  redis: {
    host: '192.168.109.106',
    port: 6379,
    db: 0,
    prefix: 'reactNodeStage-',
    password: 'yAw6H44cHUtvnjC',
  },
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
  },
};
