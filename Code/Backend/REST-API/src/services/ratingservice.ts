import pool from "../mysql-pool.js";
import type {
  FieldPacket,
  ResultSetHeader,
  RowDataPacket /*  ResultSetHeader */,
} from "mysql2";
import { Rating } from "../types.js";

class RatingService {
  async getUserRating(recipe_id: number, username: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT rating FROM ratings WHERE username = ? AND recipe_id = ?",
      [username, recipe_id]
    );

    return results as Rating[];
  }

  async getAverage(recipe_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT AVG(rating) as rating FROM ratings WHERE recipe_id = ?",
      [recipe_id]
    );

    return results as Rating[];
  }

  async create(recipe_id: number, username: string, rating: number) {
    await pool.query(
      "INSERT INTO ratings (recipe_id, username, rating) VALUES (?, ?, ?)",
      [recipe_id, username, rating]
    );

    return;
  }

  async update(recipe_id: number, username: string, rating: number) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "UPDATE ratings SET rating = ? WHERE username = ? AND recipe_id = ?",
      [rating, username, recipe_id]
    );

    if (results.affectedRows == 0) throw new Error("No row updated");

    return;
  }
  async delete(recipe_id: number, username: string) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "DELETE FROM ratings WHERE username = ? AND recipe_id = ?",
      [username, recipe_id]
    );

    if (results.affectedRows == 0) throw new Error("No row deleted");

    return;
  }
}

const ratingService = new RatingService();

export { ratingService };
