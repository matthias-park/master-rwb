module.exports = {
  name: 'rwb',
  domains: [
    {
      hostname: 'rwb.local',
      api: 'https://rwbapi-dev.strivegaming.us',
      local: 'http://rwb.local:3000',
    },
  ],
  theme: 'rwb',
  themeSettings: require('./themeSettings/rwb'),
  dateFormat: 'YYYY-MM-DD',
  smartyStreets: '108064515683753034',
  casino: true,
  componentSettings: {
    userIdleTimeout: 30,
    v2Auth: 'wss://rwbws-dev.strivegaming.us',
    showTimedOutPlayerBanner: true,
    showValidatorStatusBanner: true,
    login: {
      activateBeforeLogin: true,
      loginCookiesAccept: true,
      multiStepLoginForm: true,
    },
    register: {
      multiStepLoginForm: true,
      filterFormIDs: [
        'personal_account_check',
        'info_accuracy_check',
        'terms_and_conditions',
      ],
    },
    modals: {
      TnC: true,
      ResponsibleGambling: false,
      ValidationFailed: true,
      CookiePolicy: true,
      AddBankAccount: true,
      GeoComply: true,
      PlayerDisabled: true,
      DepositThreshold: true,
      KBAQuestions: true,
    },
    header: {
      needsBurger: true,
      needsCompanyLogo: true,
    },
    transactions: {
      needsOverviewTable: true,
    },
  },
};
