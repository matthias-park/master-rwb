module.exports = {
  name: 'gcg',
  domains: [
    {
      hostname: 'gcg.local',
      api: 'https://gnogazapi-dev.strivegaming.us',
      local: 'http://gnogaz.local:3000',
    },
  ],
  theme: 'strive',
  sbTechUrl: 'https://gnogaz-fe-sandbox.strivegaming.us',
  themeColor: '#000541',
  themeSettings: require('./themeSettings/gcg'),
  dateFormat: 'MM-DD-YYYY',
  componentSettings: {
    userIdleTimeout: 30,
    v2Auth: 'wss://gnogaz-ws.strivegaming.us',
    useBalancesEndpoint: true,
    register: {
      parseMiddlename: true,
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
