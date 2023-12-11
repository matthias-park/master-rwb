module.exports = {
  name: 'rwb',
  domains: [
    {
      hostname: 'rwb.local',
      api: ' https://cms-uat-genting.strivegaming.dev',
      local: 'http://rwb.local:3000',
    },
  ],
  theme: 'rwb',
  themeSettings: require('./themeSettings/rwb'),
  dateFormat: 'MM-DD-YYYY',
  smartyStreets: '108064517886631271',
  geoComplyKey: 'oQeVf0ojxN',
  zendesk: 'a065ceaf-2ca9-436c-821b-37418041092d',
  casino: true,
  componentSettings: {
    userIdleTimeout: 30,
    v2Auth: 'wss://rwbws-dev.strivegaming.us',
    useBalancesEndpoint: true,
    showTimedOutPlayerBanner: true,
    showValidatorStatusBanner: true,
    login: {
      activateBeforeLogin: true,
      loginCookiesAccept: true,
      multiStepLoginForm: true,
    },
    register: {
      multiStepForm: true,
      requiredValidations: {
        needsLength: 7,
        needsLowerCase: true,
        needsUpperase: true,
        needsNumbers: true,
        needsSpecialCharacters: true,
        needsEmail: true,
      },
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
      geoComplyStatusAlert: true,
      needsCompanyLogo: true,
    },
    bonuses: {
      queueBonuses: {
        paginate: true,
        searchBar: true,
      },
    },
    transactions: {
      needsOverviewTable: true,
    },
    geoComply: {
      checkOnCasinoGame: true,
    },
  },
};
