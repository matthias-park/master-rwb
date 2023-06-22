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
    historyRouting: true,
  },
  gtmId: 'GTM-KBCKVS5',
  geoComplyKey: 'ShzolMaAK',
  smartyStreets: '108064515683753034',
  xtremepush: 'https://us.webpu.sh/8UCYTGU9kjyxCCgQtCqROPz24HI_2FvA/sdk.js',
  zendesk: 'ca06421f-4795-449d-905a-f3f4a7bb6f58',
  fullStory: true,
  leverageMedia: true,
  appleAppMeta: 'app-id=1599512297',
  iconSizes: ['70', '144', '150', '192', '512'],
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
      geoComplyStatusAlert: true,
    },
    geoComply: {
      checkOnLogin: true,
    },
    bonuses: {
      queueBonuses: {
        paginate: true,
        searchBar: true,
      },
    },
    communicationPreferences: {
      mobilePref: true,
      endPointVerison: 'v2',
    },
  },
};
