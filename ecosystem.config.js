module.exports = {
  apps: [
    {
      name: 'next-web',
      script: 'web.js',
      cwd: '/home/tonybet/next-web/current',
      pid_file: '/home/tonybet/next-web/current/pids/web.pid',
      out_file: '/dev/null',
      error_file: '/dev/null',
      env: {
        NODE_ENV: 'development',
      },
      env_stage: {
        NODE_ENV: 'stage',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
