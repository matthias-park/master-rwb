server '192.168.109.27', user: 'tonybet', roles: %w(next-web-stage stage-release)

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/tonybet/next-web-stage-rworldbet'

set :nvm_type, :user
set :nvm_node, 'v15.4.0'
set :nvm_map_bins, %w{node npm pm2}
set :build_env, 'stage'
set :app_instance, 'resortsWorldBet'

append :linked_dirs, 'node_modules'
set :keep_releases, 1

set :default_env, {
  NODE_ENV: fetch(:build_env),
  NODE_APP_INSTANCE: fetch(:app_instance),
  NODE_PATH: fetch(:deploy_to),
}

set :branch, ENV['branch'] || ask('Branch name to deploy?', :develop)

