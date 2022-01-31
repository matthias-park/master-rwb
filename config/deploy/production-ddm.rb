require 'net/ssh/proxy/command'

server '192.168.90.21', user: 'deploy', roles: %w(next-web prod-release)
server '192.168.90.22', user: 'deploy', roles: %w(next-web prod-release)

set :deploy_to, '/home/deploy/next-web'

set :nvm_type, :user
set :nvm_node, 'v12.22.6'
set :nvm_map_bins, %w{node npm pm2}
set :build_env, 'production'

set :default_env, {
  NODE_ENV: :production,
  NODE_APP_INSTANCE: 'desertDiamond'
}

