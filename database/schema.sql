-- Drop tables if they exist (order matters for FKs)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS group_buy_items CASCADE;
DROP TABLE IF EXISTS group_buys CASCADE;
DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'leader', 'customer')),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table (SKU)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    base_price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    shelf_life_days INT, -- For expiration logic
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stations Table (Community Points)
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    leader_id INT NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Buys (Events)
CREATE TABLE group_buys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'ended', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group Buy Items (Inventory for specific event)
CREATE TABLE group_buy_items (
    id SERIAL PRIMARY KEY,
    group_buy_id INT NOT NULL REFERENCES group_buys(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    price DECIMAL(10, 2) NOT NULL, -- Deal price
    stock INT NOT NULL DEFAULT 0,
    sold_count INT DEFAULT 0,
    UNIQUE(group_buy_id, product_id)
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    station_id INT NOT NULL REFERENCES stations(id),
    group_buy_id INT NOT NULL REFERENCES group_buys(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'arrived', 'completed', 'cancelled')),
    pickup_code VARCHAR(10), -- Verification code for picking up
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL -- Price at time of purchase
);

-- Indexes for performance
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_station ON orders(station_id);
CREATE INDEX idx_gb_items_gb ON group_buy_items(group_buy_id);
