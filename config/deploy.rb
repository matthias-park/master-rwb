# config valid only for current version of Capistrano
lock '3.8.2'

set :application, 'next-web'
set :repo_url, 'ssh://tonybet@ph.tonybet.com/diffusion/NNW/nodejs-next-web.git'

# Default branch is :master
set :branch, ENV['branch'] || ask('Branch name to deploy?', :master)

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, 'config/database.yml', 'config/secrets.yml'

# Default value for linked_dirs is []
append :linked_dirs, 'logs', 'pids'

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5
