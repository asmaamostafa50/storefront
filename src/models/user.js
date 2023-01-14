"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
class UserStore {
    async create(u) {
        try {
            const sql = 'INSERT INTO users (user_name, password, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *';
            const conn = await database_1.default.connect();
            const hash = bcrypt_1.default.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.user_name, hash, u.first_name, u.last_name]);
            const user = result.rows[0];
            console.log("hello user: " + user);
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not add new user ${u.user_name} . Error: ${err.message}`);
        }
    }
    async authenticate(user_name, password) {
        const sql = `SELECT * FROM users WHERE user_name='${user_name}'`;
        const conn = await database_1.default.connect();
        const result = await conn.query(sql);
        conn.release();
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                return user;
            }
        }
        return null;
    }
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err.message}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const numberOfDeletedRows = result.rowCount;
            conn.release();
            return numberOfDeletedRows;
        }
        catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
