import pool from "../mysql-pool.js";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { User, UserCreate, UserUpdate } from "../types.js";
import { loginService } from "./loginservice.js";

class UserService {
  async get(username: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT name, image_id FROM users WHERE name = ?",
      [username]
    );

    return results as User[];
  }

  async create({ name, password, image_id }: UserCreate) {
    const hashed_password = await loginService.hash(password);

    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "INSERT INTO users (name, password, image_id) VALUES (?, ?, ?)",
      [name, hashed_password, image_id]
    );

    return results.insertId;
  }

  async delete(username: string) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "DELETE FROM users WHERE name = ?",
      [username]
    );
    if (results.affectedRows == 0) throw new Error("No row deleted");

    return;
  }

  async update(username: string, { password, name, image_id }: UserUpdate) {
    if (!(name || password || image_id)) throw new Error("No valid values");

    if (password)
      await pool.query("UPDATE users SET password = ? WHERE name = ?", [
        password,
        username,
      ]);

    if (image_id)
      await pool.query("UPDATE users SET image_id = ? WHERE name = ?", [
        image_id,
        username,
      ]);
    if (name)
      await pool.query("UPDATE users SET name = ? WHERE name = ?", [
        name,
        username,
      ]);

    return;
  }
}

export const userService = new UserService();
