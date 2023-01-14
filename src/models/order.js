"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
class OrderStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders. Error: ${err.message}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err.message}`);
        }
    }
    async create(user_id) {
        try {
            const sql = 'INSERT INTO orders (user_id,completed) VALUES($1, false) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [user_id]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not create new order with user_id : ${user_id} . Error: ${err.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const numberOfDeletedRows = result.rowCount;
            conn.release();
            return numberOfDeletedRows;
        }
        catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`);
        }
    }
    async update(id, title, completed) {
        try {
            const titleType = typeof title !== 'undefined';
            const completedType = typeof completed !== 'undefined';
            const conn = await database_1.default.connect();
            let sql, result, order;
            if (titleType && completedType) {
                sql =
                    'Update orders SET title=($2),completed=($3) WHERE id=($1) RETURNING *';
                result = await conn.query(sql, [id, title, completed]);
                order = result.rows[0];
            }
            else if (titleType) {
                sql = 'Update orders SET title=($2) WHERE id=($1) RETURNING *';
                result = await conn.query(sql, [id, title]);
                order = result.rows[0];
            }
            else {
                sql = 'Update orders SET completed=($2) WHERE id=($1) RETURNING *';
                result = await conn.query(sql, [id, completed]);
                order = result.rows[0];
            }
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not update order ${id}. Error: ${err}`);
        }
    }
    async getUserOrders(id) {
        try {
            const sql = 'SELECT * FROM orders WHERE user_id=($1) and completed=false';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err.message}`);
        }
    }
}
exports.OrderStore = OrderStore;
