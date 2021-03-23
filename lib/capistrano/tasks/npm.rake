PrecompileRequired = Class.new(StandardError)

namespace :npm do
  desc 'Build bundle.js'
  task :build do
    if ENV['NOBUILD']
      puts 'Skipping building bundles (NOBUILD set)'
    else
      on roles(['next-web', 'next-web-test']) do
        within release_path do
          execute :npm, :run, "build:#{rails_env}"
        end
      end
    end
  end
  after 'deploy:updated', 'npm:build'

    desc 'run npm install'
    task :npm_install do
      on roles(['stage-release']) do
        begin
          file = 'package.json'
          execute :diff, '-q', current_path.join(file), release_path.join(file) rescue raise(PrecompileRequired)
          puts 'Skipping npm:install no changes'
        rescue PrecompileRequired
          within release_path do
            execute :npm, :install
          end
        end
      end
      on roles (['prod-release']) do
         within release_path do
           execute :npm, :ci
         end
      end
    end
    before 'deploy:updated', 'npm:npm_install'
end