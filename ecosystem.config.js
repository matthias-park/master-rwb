module.exports = {
  apps: [
    {
      name: 'next-web',
      script: './web.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
