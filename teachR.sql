-- Database creation and setup
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create and select database
DROP DATABASE IF EXISTS `teachR`;
CREATE DATABASE IF NOT EXISTS `teachR`;
USE `teachR`;

-- Drop tables in correct order
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `user`;

-- Create tables
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) NOT NULL,
    roles JSON NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT UNIQ_IDENTIFIER_EMAIL UNIQUE (email)
);

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categorie_id INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix FLOAT NOT NULL,
    date_creation DATETIME NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES category(id)
);

-- Insert admin user (password is hashed version of 'password123')
INSERT INTO user (email, roles, password) VALUES 
('admin@teach-r.com', '["ROLE_ADMIN","ROLE_USER"]', '$2y$13$SeFoUdJwsmSe7BqRAwYa6e92lDRqkEFdfcmEV.QAE0ASU.LiJzCcu');

-- Insert sample categories
INSERT INTO category (nom) VALUES 
('Electronics'),
('Books'),
('Clothing'),
('Sports'),
('Home & Garden');

-- Insert 20 sample products
INSERT INTO product (categorie_id, nom, description, prix, date_creation) VALUES 
-- Electronics (category_id: 1)
(1, 'Laptop Pro', 'High performance laptop with latest specs', 999.99, '2024-01-15 10:00:00'),
(1, 'Smartphone X', 'Latest generation smartphone', 699.99, '2024-01-15 10:01:00'),
(1, 'Wireless Earbuds', 'Premium noise-canceling earbuds', 199.99, '2024-01-15 10:02:00'),
(1, 'Smart Watch', 'Fitness and health tracking smartwatch', 299.99, '2024-01-15 10:03:00'),

-- Books (category_id: 2)
(2, 'Programming Guide', 'Complete guide to modern programming', 49.99, '2024-01-15 10:04:00'),
(2, 'Data Science Basics', 'Introduction to data science and analytics', 39.99, '2024-01-15 10:05:00'),
(2, 'AI & Machine Learning', 'Comprehensive guide to AI', 59.99, '2024-01-15 10:06:00'),
(2, 'Web Development', 'Full-stack web development handbook', 45.99, '2024-01-15 10:07:00'),

-- Clothing (category_id: 3)
(3, 'Winter Jacket', 'Warm and comfortable winter jacket', 89.99, '2024-01-15 10:08:00'),
(3, 'Running Shoes', 'Professional running shoes', 129.99, '2024-01-15 10:09:00'),
(3, 'Casual Jeans', 'Comfortable everyday jeans', 59.99, '2024-01-15 10:10:00'),
(3, 'Cotton T-Shirt', 'Premium cotton casual t-shirt', 24.99, '2024-01-15 10:11:00'),

-- Sports (category_id: 4)
(4, 'Tennis Racket', 'Professional tennis racket', 159.99, '2024-01-15 10:12:00'),
(4, 'Basketball', 'Official size basketball', 29.99, '2024-01-15 10:13:00'),
(4, 'Yoga Mat', 'Non-slip professional yoga mat', 39.99, '2024-01-15 10:14:00'),
(4, 'Dumbbells Set', '5-25kg adjustable dumbbells set', 199.99, '2024-01-15 10:15:00'),

-- Home & Garden (category_id: 5)
(5, 'Garden Tools Set', 'Complete set of essential garden tools', 129.99, '2024-01-15 10:16:00'),
(5, 'Smart Plant Pot', 'Self-watering plant pot with sensors', 49.99, '2024-01-15 10:17:00'),
(5, 'LED Grow Light', 'Full spectrum plant grow light', 79.99, '2024-01-15 10:18:00'),
(5, 'Pruning Shears', 'Professional grade garden scissors', 34.99, '2024-01-15 10:19:00');

-- Copy for 40 items (pagination feature)
(1, 'Laptop Pro', 'High performance laptop with latest specs', 999.99, '2024-01-15 10:00:00'),
(1, 'Smartphone X', 'Latest generation smartphone', 699.99, '2024-01-15 10:01:00'),
(1, 'Wireless Earbuds', 'Premium noise-canceling earbuds', 199.99, '2024-01-15 10:02:00'),
(1, 'Smart Watch', 'Fitness and health tracking smartwatch', 299.99, '2024-01-15 10:03:00'),

-- Books (category_id: 2)
(2, 'Programming Guide', 'Complete guide to modern programming', 49.99, '2024-01-15 10:04:00'),
(2, 'Data Science Basics', 'Introduction to data science and analytics', 39.99, '2024-01-15 10:05:00'),
(2, 'AI & Machine Learning', 'Comprehensive guide to AI', 59.99, '2024-01-15 10:06:00'),
(2, 'Web Development', 'Full-stack web development handbook', 45.99, '2024-01-15 10:07:00'),

-- Clothing (category_id: 3)
(3, 'Winter Jacket', 'Warm and comfortable winter jacket', 89.99, '2024-01-15 10:08:00'),
(3, 'Running Shoes', 'Professional running shoes', 129.99, '2024-01-15 10:09:00'),
(3, 'Casual Jeans', 'Comfortable everyday jeans', 59.99, '2024-01-15 10:10:00'),
(3, 'Cotton T-Shirt', 'Premium cotton casual t-shirt', 24.99, '2024-01-15 10:11:00'),

-- Sports (category_id: 4)
(4, 'Tennis Racket', 'Professional tennis racket', 159.99, '2024-01-15 10:12:00'),
(4, 'Basketball', 'Official size basketball', 29.99, '2024-01-15 10:13:00'),
(4, 'Yoga Mat', 'Non-slip professional yoga mat', 39.99, '2024-01-15 10:14:00'),
(4, 'Dumbbells Set', '5-25kg adjustable dumbbells set', 199.99, '2024-01-15 10:15:00'),

-- Home & Garden (category_id: 5)
(5, 'Garden Tools Set', 'Complete set of essential garden tools', 129.99, '2024-01-15 10:16:00'),
(5, 'Smart Plant Pot', 'Self-watering plant pot with sensors', 49.99, '2024-01-15 10:17:00'),
(5, 'LED Grow Light', 'Full spectrum plant grow light', 79.99, '2024-01-15 10:18:00'),
(5, 'Pruning Shears', 'Professional grade garden scissors', 34.99, '2024-01-15 10:19:00');

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;