module.exports = {
  franchises: {
    bnl: {
      domains: [
        {
          hostname: 'bnl-rj.tglab.dev',
          api: 'https://bnl-dev.tglab.dev',
          forceWWW: false,
        },
      ],
      gtmId: 'GTM-PGRW8BQ',
      basicAuthEnabled: true,
    },
    strive: {
      basicAuthEnabled: true,
      domains: [
        {
          hostname: 'strive-rj.tglab.dev',
          api: 'https://strive-dev.tglab.dev',
        },
      ],
    },
    desertDiamond: {
      basicAuthEnabled: true,
      domains: [
        {
          hostname: 'ddm-fe.strivegaming.us',
          api: 'https://ddmapi-dev.strivegaming.us',
        },
      ],
    },
    xcasino: {
      basicAuthEnabled: true,
      domains: [
        {
          hostname: 'xcasino-rj.tglab.dev',
          api: 'https://pla-dev.tglab.dev',
        },
      ],
    },
    gnogaz: {
      basicAuthEnabled: true,
      domains: [
        {
          hostname: 'gnogaz-fe.strivegaming.us',
          api: 'https://gnogazapi-dev.strivegaming.us',
        },
      ],
    },
    gnogon: {
      domains: [
        {
          hostname: 'gnogon-fe.strivegaming.us',
          api: 'https://gnogazapi-dev.strivegaming.us',
        },
      ],
      basicAuthEnabled: true,
    },
    xcasinoCom: {
      basicAuthEnabled: true,
      domains: [
        {
          hostname: 'xcasinocom-rj.tglab.dev',
          api: 'https://pla-dev.tglab.dev',
        },
      ],
    },
  },
  sentryDsn: 'https://bc58950e0bc549ceab635a17b85e928b@sentry.tglab.dev/9',
};
