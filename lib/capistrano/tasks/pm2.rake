namespace :pm2 do
  desc 'start (or restart) all applications (depending on roles) using ecosystem.config.js descriptions'
  task :start_or_restart do
    if ENV['NORESTART']
      puts 'Skipping restarting (NORESTART set)'
    else
      ['next-web', 'next-web-test'].each do |role|
        on roles(role) do
          within current_path do
            execute :pm2, :start, 'ecosystem.config.js', '--only', role, '--env', ENV['build_env']
          end
        end
      end
    end
  end

  after 'deploy:published', 'pm2:start_or_restart'
  # after 'deploy:finished', 'pm2:run_tests'
end