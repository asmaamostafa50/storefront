import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  completed: boolean;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find order ${id}. Error: ${(err as Error).message}`
      );
    }
  }

  async create(user_id: number): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id,completed) VALUES($1, false) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [user_id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not create new order with user_id : ${user_id} . Error: ${
          (err as Error).message
        }`
      );
    }
  }
  
  async getUserOrders(id: number): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) and completed=false';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not find order ${id}. Error: ${(err as Error).message}`
      );
    }
  }
}
