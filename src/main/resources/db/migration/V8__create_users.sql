CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

INSERT INTO users (username, password, role) VALUES ('admin', '$2b$10$x51mF.Eh4RAw26.llr2OSeEPbwIuRzhW3/3u1MRVMoHauFP5VgaWW', 'ADMIN');

ALTER TABLE orders ADD COLUMN user_id BIGINT REFERENCES users(id);
