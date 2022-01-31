module.exports = {
  name: 'xcasino',
  domains: [
    {
      hostname: 'xcasino.local',
      api: 'https://pla-dev.tglab.dev',
    },
  ],
  themeColor: '#000541',
  theme: 'xcasino',
  dateFormat: 'YYYY-MM-DD',
  redis: {
    host: '192.168.109.106',
    port: 6379,
    db: 0,
    prefix: 'reactNodeStage-',
    password: 'yAw6H44cHUtvnjC',
  },
  tgLabSb: {
    id: 56,
    bundle: 'https://nstest.tonybet.com/js/sbwrp.js',
    format: 'eu',
  },
  componentSettings: {
    v2Auth: 'wss://xcasino-ws.tglab.dev',
    limitsOnAction: ['login', 'logout', 'playCasino'],
    modals: {
      limits: true,
    },
  },
  casino: true,
};
