server '192.168.109.27', user: 'tonybet', roles: %w(next-web-test stage-release)

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/tonybet/next-web-test'

set :nvm_type, :user
set :nvm_node, 'v15.4.0'
set :nvm_map_bins, %w{node npm pm2}
ENV['build_env'] = :env

append :linked_dirs, 'node_modules'

set :default_env, {
  NODE_ENV: :env,
}

set :branch, ENV['branch'] || ask('Branch name to deploy?', :master)
