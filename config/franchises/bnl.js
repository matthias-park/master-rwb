module.exports = {
  name: 'bnl',
  domains: [
    {
      hostname: 'bnl.local',
      api: 'https://bnl-dev.tglab.dev',
    },
  ],
  theme: 'bnl',
  kambi: {
    market: 'BE',
    currency: 'EUR',
    retail: 'https://ctn-static.kambi.com/client/bnlberl/kambi-bootstrap.js',
    online: 'https://ctn-static.kambi.com/client/bnlbe/kambi-bootstrap.js',
    api: 'https://ctn-static.kambi.com/client/widget-api/kambi-widget-api.js',
    eventStatistics:
      'https://s5.sir.sportradar.com/scooorebe/{{locale}}/match/m{{eventId}}',
    enableOddsFormatSelector: true,
  },
  excludeBasicAuthFiles: [
    '/assets/styles/light-theme.css',
    '/assets/styles/dark-theme.css',
    '/assets/images/promo/desktop/promoboost/ProfitBoost-Desktop_1@1x.png',
    '/assets/images/promo/desktop/promoboost/ProfitBoost-Desktop_1@2x.png',
    '/assets/images/promo/desktop/promoboost/ProfitBoost-Desktop_1@3x.png',
    '/assets/images/promo/mobile/promoboost/ProfitBoost-Mobile_1@1x.png',
    '/assets/images/promo/mobile/promoboost/ProfitBoost-Mobile_1@2x.png',
    '/assets/images/promo/mobile/promoboost/ProfitBoost-Mobile_1@3x.png',
    '/assets/images/promo/desktop/promowelcome/Welcome-Desktop_1@1x.png',
    '/assets/images/promo/desktop/promowelcome/Welcome-Desktop_1@2x.png',
    '/assets/images/promo/desktop/promowelcome/Welcome-Desktop_1@3x.png',
    '/assets/images/promo/mobile/promowelcome/Welcome-Mobile_1@1x.png',
    '/assets/images/promo/mobile/promowelcome/Welcome-Mobile_1@2x.png',
    '/assets/images/promo/mobile/promowelcome/Welcome-Mobile_1@3x.png',
    '/assets/images/promo/desktop/profitboost/LIVEProfitBoost-Desktop_1@1x.png',
    '/assets/images/promo/desktop/profitboost/LIVEProfitBoost-Desktop_1@2x.png',
    '/assets/images/promo/desktop/profitboost/LIVEProfitBoost-Desktop_1@3x.png',
    '/assets/images/promo/mobile/profitboost/LIVEProfitBoost-Mobile_1@1x.png',
    '/assets/images/promo/mobile/profitboost/LIVEProfitBoost-Mobile_1@2x.png',
    '/assets/images/promo/mobile/profitboost/LIVEProfitBoost-Mobile_1@3x.png',
  ],
  googleRecaptchaKey: '6Lezp2oaAAAAADpwV6q_a2k7yVPD52Qb89Z2zFcR',
  themeColor: '#000541',
  iconSizes: ['128', '192', '512'],
  redis: {
    host: '192.168.109.106',
    port: 6379,
    db: 0,
    prefix: 'reactNodeStage-',
    password: 'yAw6H44cHUtvnjC',
  },
  dateFormat: 'YYYY-MM-DD',
  componentSettings: {
    login: {
      emailLogin: true,
    },
    modals: {
      TnC: true,
      ResponsibleGambling: true,
      ValidationFailed: true,
      CookiePolicy: true,
      AddBankAccount: true,
    },
  },
};