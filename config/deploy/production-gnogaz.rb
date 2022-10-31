require 'net/ssh/proxy/command'

server '192.168.150.21', user: 'deploy', roles: %w(next-web prod-release)
server '192.168.150.22', user: 'deploy', roles: %w(next-web prod-release)

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/deploy/next-web'

set :nvm_type, :user
set :nvm_node, 'v12.22.6'
set :nvm_map_bins, %w{node npm pm2}
set :build_env, 'production'

set :default_env, {
  NODE_ENV: fetch(:build_env),
  NODE_APP_INSTANCE: fetch(:app_instance),
  NODE_PATH: fetch(:deploy_to),
}

