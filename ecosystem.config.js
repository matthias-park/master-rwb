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
  deploy: {
    stage: {
      user: 'tonybet',
      host: ['192.168.109.27'],
      ref: 'origin/develop',
      repo: 'ssh://tonybet@ph.tonybet.com/diffusion/NNW/nodejs-next-web.git',
      path: '/home/tonybet/next-web',
      'post-deploy':
        'npm install && npm run build:stage && pm2 startOrRestart ecosystem.json --env stage',
      env: {
        NODE_ENV: 'stage',
      },
    },
    testing: {
      user: 'tonybet',
      host: ['192.168.109.27'],
      ref: 'origin/master',
      repo: 'ssh://tonybet@ph.tonybet.com/diffusion/NNW/nodejs-next-web.git',
      path: '/home/tonybet/next-web-test',
      'post-deploy':
        'npm install && npm run build:test && pm2 startOrRestart ecosystem.json --env test',
      env: {
        NODE_ENV: 'test',
      },
    },
  },
};
