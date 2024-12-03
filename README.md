# Teach'r Full-Stack Developer Technical Test

## Project Overview

This project is designed to demonstrate full-stack development skills using **React.js** for the frontend and **Symfony** with **API Platform** for the backend. The goal is to create an application for managing products and categories.

### Goals:

- **Backend:** Develop a RESTful API to manage products and categories, including basic CRUD operations and JWT authentication for secured actions.
- **Frontend:** Build a user interface to interact with this API, showcasing data management, state management with Redux, and UI design with TailwindCSS.

## Installation

### Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
2. **Install dependencies:**
    ```bash
    composer install
3. **Create a .env.local file and configure your database settings:**
    ```bash
    cp .env .env.local
    # Edit .env.local with your database credentials
    
    vim .env.local
5. **Create DB and run migrations:**
    ```bash
    php bin/console doctrine:database:create
    php bin/console doctrine:migrations:migrate
    mysql -u root -P 3306 teachR < teachR.sql
5. **Generate JWT keys:**
    ```bash
    php bin/console lexik:jwt:generate-keypair
6. **Run Symfony Server:**
    ```bash
    symfony server:start -d
    ```

### Frontend

1. **Navigate to the frontend directory:**
    ```bash
    cd frontend
2. **Install dependencies:**
    ```bash
    npm install # or bun install
3. **Run the development server:**
    ```bash
    npm run dev # or bun run dev
    ```

## Additional Information
**Backend API documentation is available at:** http://localhost:8000/api/docs

**Frontend application:** http://localhost:3000

**Default admin credentials:**   

    Email: admin@teach-r.com

    Password: password

### Protected Actions
**Only authenticated admin users can:**

    - Edit products
    - Delete products
    - Create new products


## Running Tests (not Working)
**Backend Test:**
```bash
# Run PHPUnit tests
./vendor/bin/phpunit
