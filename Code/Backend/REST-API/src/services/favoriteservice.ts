import pool from "../mysql-pool.js";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { DisplayRecipe, Favorite } from "../types.js";

class FavoriteService {
  async getAll(username: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT recipes.* FROM favorites JOIN recipes ON favorites.recipe_id = recipes.id WHERE favorites.username = ?",
      [username]
    );
    console.log(`Retrieved all favorite recipes successfully:`, results);

    return results as DisplayRecipe[];
  }

  async create(username: string, recipe_id: number) {
    await pool.query(
      "INSERT INTO favorites (username, recipe_id) VALUES (?, ?)",
      [username, recipe_id]
    );
    console.log("Added recipe to favorites successfully.");

    return;
  }

  async get(username: string, recipe_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT recipe_id FROM favorites WHERE username = ? AND recipe_id = ?",
      [username, recipe_id]
    );
    console.log("Get Favorite", results);

    return results as Favorite[];
  }

  async delete(username: string, recipe_id: number) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "DELETE FROM favorites WHERE username = ? AND recipe_id = ?",
      [username, recipe_id]
    );
    if (results.affectedRows === 0)
      throw new Error(
        "No favorite recipe deleted for the specified username and recipeId."
      );

    console.log("Deleted favorite recipe successfully.");

    return;
  }
}

export const favoriteService = new FavoriteService();
