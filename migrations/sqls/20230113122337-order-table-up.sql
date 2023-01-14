CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  completed BOOLEAN Not NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL
);