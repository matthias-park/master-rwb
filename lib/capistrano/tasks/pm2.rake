namespace :pm2 do
  desc 'start (or restart) all applications (depending on roles) using ecosystem.config.js descriptions'
  task :start_or_restart do
    if ENV['NORESTART']
      puts 'Skipping restarting (NORESTART set)'
    else
      ['next-web', 'next-web-test', 'next-web-stage', 'next-web-fork-deploy'].each do |role|
        on roles(role) do
          within current_path do
            execute :pm2, :restart, 'ecosystem.config.js', '--only', "next-web-#{fetch(:build_env)}-#{fetch(:app_instance)}", '--env', fetch(:build_env)
          end
        end
      end
    end
  end

  after 'deploy:published', 'pm2:start_or_restart'
  # after 'deploy:finished', 'pm2:run_tests'
end