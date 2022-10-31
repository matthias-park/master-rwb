const fs = require('fs');

const franchises = fs.readdirSync('config/franchises').reduce((obj, value) => {
  if (!value.includes('.js')) return obj;
  const fr = value.replace('.js', '');
  obj[fr] = require(`./franchises/${fr}`);
  return obj;
}, {});

module.exports = {
  franchises,
  port: 3800,
  redis: {
    host: '192.168.109.223',
    port: 6379,
    db: 0,
    prefix: 'v5:reactNodeStage-',
    password: '48d250eb47f22dc33ada',
  },
  basicAuth: {
    whitelistedIp: [
      '88.119.158.27',
      '88.119.17.78',
      '78.60.222.254',
      '78.63.1.7',
      '88.119.17.78',
      '93.157.73.168',
      '185.172.85.185',
    ],
    users: [
      {
        username: 'tbtest',
        password: 'B3st.P4ssword',
      },
      {
        username: 'tbtest',
        password: 'wCrXilO_iq!N',
      },
    ],
    mobileViewExcludedPages: {
      desertDiamond: [
        'terms_conditions_link',
        'privacy_policy_link',
        'nav_link_responsible_gaming',
        'sitemap_houseRules',
        'sitemap_resetPassword',
      ],
    },
  },
};
