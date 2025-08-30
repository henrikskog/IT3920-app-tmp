import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "../mysql-pool.js";
import bcrypt from "bcrypt";

class LoginService {
  async auth(name: string, password: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT password FROM users WHERE name = ?",
      [name]
    );

    const result = await bcrypt.compare(password, results[0].password);

    return result;
  }

  async hash(plaintext: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plaintext, salt);
    return hash;
  }
}

const loginService = new LoginService();
export { loginService };
