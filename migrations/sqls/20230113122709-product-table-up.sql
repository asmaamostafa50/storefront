CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) Not NULL UNIQUE,
  price INTEGER NOT NULL
);