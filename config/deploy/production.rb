require 'net/ssh/proxy/command'

server '192.168.20.121', user: 'tonybet', roles: %w(next-web prod-release)

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/tonybet/next-web'

set :nvm_type, :user
set :nvm_node, 'v15.4.0'
set :nvm_map_bins, %w{node npm pm2}
set :build_env, 'production'

set :default_env, {
  NODE_ENV: :production,
}

