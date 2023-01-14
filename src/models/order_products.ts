import Client from '../database';
import { Product } from './product';

export type OrderProduct = {
  id?: number;
  product_id: number;
  order_id: number;
  quantity: number;
};

export class OrderProductsStore {

async addProducts(orderProducts: OrderProduct): Promise<OrderProduct> {
    try {
        const sql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
        const conn = await Client.connect();
        const result = await conn.query(sql, [orderProducts.order_id, orderProducts.product_id, orderProducts.quantity]);
        const order = result.rows[0];
        conn.release();
        return order;
    } catch (err) {
        throw new Error(
        `Could not add products to order with order_id : ${orderProducts.order_id} . Error: ${
            (err as Error).message
        }`
        );
    }
}

async showProducts(id: number): Promise<Product[]> {
    try {
    
      const conn = await Client.connect();

      const selectOrders = 'SELECT * FROM order_products WHERE order_id=($1)';
      const order_products = await conn.query(selectOrders, [id]);
      const orders_result = order_products.rows as OrderProduct[];

      //console.log(orders_result);
      
      const sql = `SELECT * FROM products WHERE id in (${orders_result.map(o => o.product_id)})`;
      const result = await conn.query(sql);
      
      //console.log(result.rows);

      conn.release();
      return result.rows;

    } catch (err) {
      throw new Error(
        `Could not find products for order_id: ${id}. Error: ${(err as Error).message}`
      );
    }
  }
}