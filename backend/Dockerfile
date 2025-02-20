FROM php:8.2-fpm

# Install system packages and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Copy project files
COPY . .

# Install dependencies
RUN composer install --prefer-dist --no-scripts --no-autoloader && rm -rf /root/.composer

# Generate autoloader
RUN composer dump-autoload --optimize

# Copy configuration files
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Create the storage directory
RUN mkdir -p /var/www/html/storage
# Change ownership and Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/

# Expose port 9000 and start php-fpm server
EXPOSE 9000

# Entrypoint script for migrations and jwt 
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["php-fpm"]