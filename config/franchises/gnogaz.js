module.exports = {
  name: 'gnogaz',
  domains: [
    {
      hostname: 'gnogaz.local',
      api: 'https://gnogazapi-dev.strivegaming.us',
    },
  ],
  theme: 'strive',
  sbTechUrl: 'https://gnogaz-fe-sandbox.strivegaming.us',
  zendesk: '6cc945cb-97c4-4c68-b189-b302de7e4868',
  smartyStreets: '113676706475958507',
  xtremepush: 'https://us.webpu.sh/Zgwm8SC36q1F-0S5QAuaKhanJF8k7fmN/sdk.js',
  geoComplyKey: '5YZkkL4ADJ',
  themeColor: '#000541',
  gtmId: 'GTM-5W6F66G',
  themeSettings: require('./themeSettings/gnogaz'),
  dateFormat: 'MM-DD-YYYY',
  componentSettings: {
    userIdleTimeout: 30,
    v2Auth: 'wss://gnogaz-ws.strivegaming.us',
    useBalancesEndpoint: true,
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
  header: {
    geoComplyStatusAlert: true,
  },
  geoComply: {
    checkOnLogin: true,
  },
  seoTitleSeparator: ' | ',
};
