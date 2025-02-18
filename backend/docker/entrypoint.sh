#!/bin/bash
set -e

echo "Installing Composer dependencies..."
composer install -vvv --prefer-dist --no-scripts --no-autoloader

echo "Running database migrations..."
php bin/console doctrine:migrations:migrate -vvv --no-interaction

echo "Loading fixtures..."
php bin/console doctrine:fixtures:load -vvv --no-interaction

echo "Generating JWT keys..."
php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction

echo "Setup completed successfully!"
exec "$@"