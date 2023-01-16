import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type User = {
  id?: number;
  first_name?: string,
  last_name?: string,
  user_name: string;
  password: string;
};

export class UserStore {
  async create(u: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (user_name, password, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();
      const hash: string = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds as string)
      );

      const result = await conn.query(sql, [u.user_name, hash, u.first_name, u.last_name]);

      const user = result.rows[0];
      console.log("hello user: "+ user);  
      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `Could not add new user ${u.user_name} . Error: ${
          (err as Error).message
        }`
      );
    }
  }

  async authenticate(
    user_name: string,
    password: string
  ): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE user_name='${user_name}'`;
    const conn = await Client.connect();

    const result = await conn.query(sql);
    conn.release();

    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + pepper, user.password)) {
        return user;
      }
    }
    return null;
  }
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${(err as Error).message}`);
    }
  }
  async delete(id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      const numberOfDeletedRows = result.rowCount;
      conn.release();

      return numberOfDeletedRows;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find user ${id}. Error: ${(err as Error).message}`
      );
    }
  }
}

