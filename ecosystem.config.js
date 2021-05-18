module.exports = {
  apps: [
    {
      name: 'next-web-stage',
      script: 'build/server/index.js',
      cwd: '/home/tonybet/next-web/current',
      pid_file: '/home/tonybet/next-web/current/pids/web.pid',
      out_file: '/dev/null',
      error_file: '/dev/null',
      env_stage: {
        NODE_ENV: 'stage',
      },
    },
    {
      name: 'next-web-test',
      script: 'build/server/index.js',
      cwd: '/home/tonybet/next-web-test/current',
      pid_file: '/home/tonybet/next-web-test/current/pids/web.pid',
      out_file: '/dev/null',
      error_file: '/dev/null',
      env_testing: {
        NODE_ENV: 'testing',
      },
    },
    {
      name: 'next-web',
      script: 'build/server/index.js',
      cwd: '/home/deploy/next-web/current',
      // instances: 4,
      pid_file: '/home/deploy/next-web/current/pids/web.pid',
      // exec_mode: 'cluster',
      out_file: '/dev/null',
      error_file: '/dev/null',
      // env_production: {
      //   NODE_ENV: 'production',
      //   NODE_APP_INSTANCE: 4,
      // },
    },
  ],
};
