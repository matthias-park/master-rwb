module.exports = {
  franchises: {
    desertDiamond: {
      basicAuthEnabled: true,
      domains: [
        {
          hostname: 'ddm-fe.strivegaming.us',
          api: 'https://ddmapi-dev.strivegaming.us',
        },
      ],
      appLinks: {
        apple: {
          webcredentials: {
            apps: ['346TY947DH.com.strivegaming.desertDiamondApp'],
          },
          applinks: {
            details: [
              {
                appIDs: ['346TY947DH.com.strivegaming.desertDiamondApp'],
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
                'BA:80:F5:74:1D:F1:38:D4:C0:12:6C:EB:D2:76:B0:1B:1A:49:09:36:A0:7F:41:A0:3B:4A:81:28:88:E6:E3:1D',
              ],
            },
          },
        ],
      },
    },
  },
  port: 3811,
};
