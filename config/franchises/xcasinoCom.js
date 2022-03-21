module.exports = {
  name: 'xcasinoCom',
  domains: [
    {
      hostname: 'xcasinocom.local',
      api: 'https://casinofiveapi-dev.tglab.dev',
    },
  ],
  theme: 'xcasinoCom',
  dateFormat: 'YYYY-MM-DD',
  themeColor: '#000541',
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
    v2Auth: 'wss://casinofive-ws.tglab.dev',
    limitsOnAction: ['login', 'logout', 'playCasino'],
    modals: {
      limits: true,
    },
  },
  casino: true,
};
