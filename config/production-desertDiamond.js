module.exports = {
  franchises: {
    desertDiamond: {
      wagerGames:
        'https://storage.googleapis.com/wager-static-assets/bundle/desertdiamond/production/bundle.js',
      appLinks: {
        apple: {
          webcredentials: {
            apps: ['TM75T75K7R.com.desertdiamond.desertdiamondsports'],
          },
          applinks: {
            details: [
              {
                appIDs: ['TM75T75K7R.com.desertdiamond.desertdiamondsports'],
                components: [
                  {
                    '/': '/$(lang)/',
                    comment: 'Matches any URL whose path is root to launch app',
                  },
                  {
                    '/': '/$(lang)/reset-password/*',
                    comment:
                      'Matches any URL whose path starts with reset password path',
                  },
                  {
                    '/': '/$(lang)/login',
                    comment:
                      'Matches any URL whose path starts with login path',
                  },
                  {
                    '/': '/$(lang)/registration/register',
                    comment:
                      'Matches any URL whose path starts with registration path',
                  },
                  {
                    '/': '/$(lang)/help/contact-us',
                    comment:
                      'Matches any URL whose path starts with contact path',
                  },
                  {
                    '/': '/$(lang)/account/wallet/deposit',
                    comment:
                      'Matches any URL whose path starts with deposit path',
                  },
                  {
                    '/': '/$(lang)/account/wallet/withdraw',
                    comment:
                      'Matches any URL whose path starts with withdraw path',
                  },
                  {
                    '/': '/$(lang)/promotions',
                    comment:
                      'Matches any URL whose path starts with promotions path',
                  },
                  {
                    '/': '/$(lang)/bonuses',
                    comment:
                      'Matches any URL whose path starts with bonuses path',
                  },
                  {
                    '/': '/$(lang)/account/profile/personal-info',
                    comment:
                      'Matches any URL whose path starts with personal info path',
                  },
                  {
                    '/': '/$(lang)/account/wallet/transactions',
                    comment:
                      'Matches any URL whose path starts with transactions path',
                  },
                  {
                    '/': '/$(lang)/responsible-gaming',
                    comment:
                      'Matches any URL whose path starts with responsible gaming path',
                  },
                  {
                    '/': '/$(lang)/account/profile/tax-information',
                    comment: 'Matches any URL whose path starts with tax path',
                  },
                  {
                    '/': '/$(lang)/account/profile/document-center',
                    comment:
                      'Matches any URL whose path starts with document center path',
                  },
                ],
              },
            ],
          },
        },
        android: [
          {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
              namespace: 'android_app',
              package_name: 'com.ddiamond.app',
              sha256_cert_fingerprints: [
                'EA:B8:2F:06:FD:C5:73:E4:99:7C:01:41:8D:2D:9F:20:82:8E:48:E8:B8:F7:EA:1C:A3:74:07:95:89:E1:94:FC',
              ],
            },
          },
        ],
      },
    },
  },
  redis: {
    host: '192.168.90.40',
    port: 6379,
    db: 12,
    prefix: 'v5:reactNodeProd-',
    password: 'CDVXfY90e4XqO6ZztwH9',
  },
  sentryDsn:
    'https://5c1d5814ea0d42c2a323b15b1310491b@o1137508.ingest.sentry.io/6190258',
};
