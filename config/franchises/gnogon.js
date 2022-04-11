module.exports = {
  name: 'gnogon',
  domains: [
    {
      hostname: 'gnogon.local',
      api: 'https://gnogonapi-dev.strivegaming.us',
    },
  ],
  theme: 'strive',
  themeSettings: require('./themeSettings/gnogon'),
  dateFormat: 'MM-DD-YYYY',
  redis: {
    host: '192.168.109.106',
    port: 6379,
    db: 0,
    prefix: 'reactNodeStage-',
    password: 'yAw6H44cHUtvnjC',
  },
  casino: true,
  componentSettings: {
    userIdleTimeout: 30,
    v2Auth: 'wss://gnogon-ws.strivegaming.us',
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
    header: {
      needsBurger: true,
    },
  },
};
