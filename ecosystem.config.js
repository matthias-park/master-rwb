module.exports = {
  apps: [
    {
      name: 'next-web',
      script: 'build/server/index.js',
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
    {
      name: 'next-web-test',
      script: 'build/server/index.js',
      cwd: '/home/tonybet/next-web-test/current',
      pid_file: '/home/tonybet/next-web-test/current/pids/web.pid',
      out_file: '/dev/null',
      error_file: '/dev/null',
      env_test: {
        NODE_ENV: 'test',
      },
    },
  ],
};
