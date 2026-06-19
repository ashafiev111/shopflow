CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(10) NOT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    price INTEGER NOT NULL,
    old_price INTEGER,
    emoji VARCHAR(10) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3,1) NOT NULL DEFAULT 0,
    sold INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    total INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    customer VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL REFERENCES orders(id),
    name VARCHAR(255) NOT NULL,
    qty INTEGER NOT NULL,
    price INTEGER NOT NULL
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
