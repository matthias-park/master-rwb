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
  geoComplyKey: '5YZkkL4ADJ',
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
      geoComplyStatusAlert: true,
    },
    geoComply: {
      checkOnCasinoGame: true,
    },
    register: {
      requiredValidations: {
        needsLength: 7,
        needsLowerCase: true,
        needsUpperase: true,
        needsNumbers: true,
        needsSpecialCharacters: true,
        needsEmail: false,
      },
    },
  },
};
