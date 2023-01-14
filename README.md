# Storefront Backend Project

## Getting Started

- To get started, clone this repo and run `yarn or npm i` in your terminal at the project root.

- you have to have a .env file in the repo, it has to contain the following variables

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=somam
POSTGRES_PASSWORD=Dev@123456
NODE_ENV=dev
BCRYPT_PASSWORD=your-secret-password
SALT_ROUNDS=10
TOKEN_SECRET=your-token-secret

- you have to create two databases with the value you set in POSTGRES_DB, POSTGRES_TEST_DB, this is an example for the SQL needed when connected to psql
`
CREATE USER somam WITH PASSWORD 'Dev@123456';    
CREATE DATABASE storefront;  
\c storefront
GRANT ALL PRIVILEGES ON DATABASE storefront TO somam;
CREATE DATABASE storefront_test;
\c storefront_test
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO somam;
`

## Overview


### 1.  DB Creation and Migrations

- to run migrations up on dev environment run `npm run devdb-up`, to run migrations down it run `npm run devdb-reset`
- to create a new migration run :db-migrate create storefront --sql-file

### 2. database.json
this is given to the db-migrate to setup different databases (test/dev) but I used only one db for both purpose, for more info check :
https://db-migrate.readthedocs.io/en/latest/Getting%20Started/configuration/


### 3. Local host ports
-for the database, port is not specified so it will run on the selected port for postgres installation (default is 5432)
-server is running on port 3000

### 4. Run & Test

- to run the application run `npm run start`
- to run database tests run `npm run test-db`
- to run apis tests run `npm run test-routes`  