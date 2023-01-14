CREATE TABLE order_products(
  id SERIAL PRIMARY KEY,
  quantity INTEGER Not NULL,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL
);