# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- app.post('/products/add', authentication);
- app.get('/products/list', getProducts);
- app.get('/products/:id', getProductById);
- app.patch('/products/edit/:id', authentication);
- app.delete('/products/delete/:id', authentication);

#### Users

- app.post('/users/add');
- app.post('/users/authenticate', authenticate);
- app.get('/users/list', authentication);
- app.delete('/users/delete/:id', authentication);
- app.get('/users/:id', authentication);

#### Orders
- app.post('/orders/add', authentication);
- app.get('/orders/list', authentication);
- app.get('/orders/get/:id', authentication);
- app.patch('/orders/edit/:id', authentication);
- app.delete('/orders/delete/:id', authentication);
- app.get('/orders/:id/getProducts', authentication);
- app.post('/orders/:id/addProduct', authentication);
- app.get('/orders/user/:id', authentication);

## Data Shapes
#### Product

    Table "public.products"

 Column |          Type          | Collation | Nullable |               Default
--------+------------------------+-----------+----------+--------------------------------------
 id     | integer                |           | not null | nextval('products_id_seq'::regclass)
 name   | character varying(100) |           | not null |
 price  | integer                |           | not null |

Indexes:
    "products_pkey" PRIMARY KEY, btree (id)
    "products_name_key" UNIQUE CONSTRAINT, btree (name)
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)


#### User

    Table "public.users"

   Column   |          Type          | Collation | Nullable |              Default
------------+------------------------+-----------+----------+-----------------------------------
 id         | integer                |           | not null | nextval('users_id_seq'::regclass)
 user_name  | character varying(100) |           | not null |
 first_name | character varying(100) |           |          |
 last_name  | character varying(100) |           |          |
 password   | character varying(255) |           | not null |

Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_user_name_key" UNIQUE CONSTRAINT, btree (user_name)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

#### Orders

    Table "public.orders"

  Column   |  Type   | Collation | Nullable |              Default
-----------+---------+-----------+----------+------------------------------------
 id        | integer |           | not null | nextval('orders_id_seq'::regclass)
 completed | boolean |           | not null |
 user_id   | integer |           | not null |

Indexes:
    "orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
Referenced by:
    TABLE "order_products" CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id)

#### OrderProducts

    Table "public.order_products"

   Column   |  Type   | Collation | Nullable |                  Default
------------+---------+-----------+----------+--------------------------------------------
 id         | integer |           | not null | nextval('order_products_id_seq'::regclass)
 quantity   | integer |           | not null |
 order_id   | integer |           | not null |
 product_id | integer |           | not null |

Indexes:
    "order_products_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "order_products_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id)
    "order_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)

