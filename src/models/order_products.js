"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProductsStore = void 0;
const database_1 = __importDefault(require("../database"));
class OrderProductsStore {
    async addProducts(orderProducts) {
        try {
            const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [orderProducts.order_id, orderProducts.product_id, orderProducts.quantity]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not add products to order with order_id : ${orderProducts.order_id} . Error: ${err.message}`);
        }
    }
    async showProducts(id) {
        try {
            const conn = await database_1.default.connect();
            const selectOrders = 'SELECT * FROM order_products WHERE order_id=($1)';
            const order_products = await conn.query(selectOrders, [id]);
            const orders_result = order_products.rows;
            //console.log(orders_result);
            const sql = `SELECT * FROM products WHERE id in (${orders_result.map(o => o.product_id)})`;
            const result = await conn.query(sql);
            //console.log(result.rows);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not find products for order_id: ${id}. Error: ${err.message}`);
        }
    }
}
exports.OrderProductsStore = OrderProductsStore;
