const franchiseEnvName = `next-web-${process.env.NODE_ENV}-${process.env.NODE_APP_INSTANCE}`;
const path = process.env.NODE_PATH;

module.exports = {
  apps: [
    {
      name: franchiseEnvName,
      script: 'build/server/index.js',
      cwd: `${path}/current`,
      pid_file: `${path}/pids/web.pid`,
      out_file: '/dev/null',
      error_file: '/dev/null',
      env_stage: {
        NODE_ENV: 'stage',
      },
      env_testing: {
        NODE_ENV: 'testing',
      },
    },
    {
      name: 'next-web',
      script: 'build/server/index.js',
      cwd: '/home/deploy/next-web/current',
      instances: 2,
      pid_file: '/home/deploy/next-web/current/pids/web.pid',
      exec_mode: 'cluster',
      out_file: '/dev/null',
      error_file: '/dev/null',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
