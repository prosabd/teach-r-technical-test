#!/bin/bash
set -e

echo "Installing Composer dependencies..."
composer install -vvv --prefer-dist --no-scripts --no-autoloader

echo "Running database migrations..."
php bin/console doctrine:database:drop --if-exists --force
php bin/console doctrine:database:create --if-not-exists --connection=default
php bin/console doctrine:migrations:migrate -n

echo "Loading fixtures..."
php bin/console doctrine:fixtures:load -n

echo "Generating JWT keys..."
php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction

php bin/console assets:install
chown 1000:1000 -R public

echo "Setup completed successfully!"
exec "$@"