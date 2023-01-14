"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err.message}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err.message}`);
        }
    }
    async create(name, price) {
        try {
            const sql = 'INSERT INTO products (name,price) VALUES($1, $2) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [name, price]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not create new product with name : ${name} . Error: ${err.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM products WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const numberOfDeletedRows = result.rowCount;
            conn.release();
            return numberOfDeletedRows;
        }
        catch (err) {
            throw new Error(`Could not delete product ${id}. Error: ${err}`);
        }
    }
    async update(id, name, price) {
        try {
            const nameType = typeof name !== 'undefined';
            const priceType = typeof name !== 'undefined';
            const conn = await database_1.default.connect();
            let sql, result, product;
            if (nameType) {
                sql =
                    'Update products SET name=($2) WHERE id=($1) RETURNING *';
                result = await conn.query(sql, [id, name]);
            }
            if (priceType) {
                sql = 'Update products SET price=($2) WHERE id=($1) RETURNING *';
                result = await conn.query(sql, [id, price]);
            }
            product = result?.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not update product ${id}. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
