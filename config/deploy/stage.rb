server '192.168.109.27', user: 'tonybet', roles: %w(next-web-stage stage-release)

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/tonybet/next-web'

set :nvm_type, :user
set :nvm_node, 'v15.4.0'
set :nvm_map_bins, %w{node npm pm2}
set :build_env, 'stage'

append :linked_dirs, 'node_modules'

set :default_env, {
  NODE_ENV: :env,
  NODE_FRANCHISE: 'all'
}

set :branch, ENV['branch'] || ask('Branch name to deploy?', :develop)
