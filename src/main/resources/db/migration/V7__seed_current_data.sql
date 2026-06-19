DELETE FROM products;
DELETE FROM categories;

ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;

INSERT INTO categories (id, name, icon) VALUES
    (1, 'Электроника', '💻'),
    (2, 'Одежда', '👕'),
    (3, 'Дом и сад', '🏡'),
    (4, 'Спорт', '⚽'),
    (5, 'Книги', '📚'),
    (6, 'Красота', '💄');
SELECT setval('categories_id_seq', 6);

INSERT INTO products (id, name, category_id, price, old_price, stock, rating, sold, image_url) VALUES
    (1,  'Ноутбук ProBook X15',          1, 89990,  NULL,  5,  0.0, 0,   '/uploads/1_70df17ae.png'),
    (2,  'Беспроводные наушники AirPods Pro', 1, 19990, NULL, 23, 4.9, 891, '/uploads/2_3ff97f7a.jpeg'),
    (3,  'Смартфон Galaxy S24',          1, 74990,  84990, 12, 4.7, 356, '/uploads/3_3dd8e35b.jpg'),
    (4,  'Умные часы Watch Series 9',    1, 34990,  NULL,  8,  4.6, 211, '/uploads/4_02767929.png'),
    (5,  'Джинсы Flared',                2, 3490,   4990,  45, 4.3, 672, '/uploads/5_1ed9bd02.jpg'),
    (6,  'Кроссовки Air Max',            2, 8990,   NULL,  19, 4.5, 488, '/uploads/6_e84647ce.jpg'),
    (7,  'Пуховик зимний',               2, 12490,  16990, 7,  4.4, 203, '/uploads/7_ab170e58.webp'),
    (8,  'Кофемашина DeLonghi',          3, 24990,  29990, 4,  4.9, 97,  'https://picsum.photos/seed/coffee/400/300'),
    (9,  'Пылесос Dyson V15',            3, 39990,  NULL,  6,  4.7, 145, '/uploads/9_00942127.png'),
    (11, 'Гантели 2×5 кг',               4, 3490,   NULL,  31, 4.5, 567, '/uploads/11_6023a386.jpeg'),
    (14, 'Сыворотка для лица',           6, 2990,   NULL,  62, 4.6, 734, '/uploads/14_0056ccbd.jpg'),
    (15, 'Парфюм Dior Sauvage',          6, 8990,   10990, 15, 4.8, 421, '/uploads/15_338c5015.jpeg');
SELECT setval('products_id_seq', 15);
