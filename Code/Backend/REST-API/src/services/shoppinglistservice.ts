import pool from "../mysql-pool.js";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { Shopping_list_base, SimpleUnitIngredient } from "../types.js";
import { recipeService } from "./recipeservice.js";

class ShoppinglistService {
  async getRecipes(username: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT id, recipe_id FROM shopping_lists WHERE username = ?",
      [username]
    );

    console.log(`Retrieved all recipes in shoppinglist successfully:`, results);
    return results as Shopping_list_base[];
  }

  async getIngredients(shoppinglist_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT ingredient, amount, unit FROM shopping_list_ingredients WHERE shoppinglist_id = ?",
      [shoppinglist_id]
    );

    console.log(
      `Retrieved all recipeingredients in shoppinglist successfully:`,
      results
    );
    return results as SimpleUnitIngredient[];
  }

  async deleteAll(username: string) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "DELETE FROM shopping_lists WHERE username = ?",
      [username]
    );

    if (results.affectedRows == 0) {
      throw new Error("No row deleted");
    }

    console.log(
      `Deleted all recipes in shoppinglist for ${results.insertId} successfully`
    );

    return;
  }

  async delete(username: string, shoppinglist_id: number) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "DELETE FROM shopping_lists WHERE username = ? AND id = ?",
      [username, shoppinglist_id] 
    );
 
    if (results.affectedRows == 0) {
      throw new Error("No row deleted");
    }

    console.log(`Deleted recipe in shoppinglist successfully`);
    return;
  }

  async create(username: string, recipe_id: number) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "INSERT INTO shopping_lists (username, recipe_id) VALUES (?, ?)",
      [username, recipe_id]
    );

    const shoppingListId = results.insertId;

    const ingredients = await recipeService.getIngredients(recipe_id);

    await pool.query(
      "INSERT INTO shopping_list_ingredients (shoppinglist_id, ingredient, amount, unit) VALUES ?",
      [
        ingredients.map(({ ingredient, amount, unit }) => [
          shoppingListId,
          ingredient,
          amount,
          unit,
        ]),
      ]
    );
    return;
  }

  async boughtAll(username: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      `SELECT ingredient, amount, unit FROM shopping_list_ingredients JOIN shopping_list ON id = shopping_list_id WHERE username = ?`,
      [username]
    );

    const boughtIngredients = results as SimpleUnitIngredient[];

    await Promise.all(
      boughtIngredients.map((i) =>
        pool.query(
          `INSERT INTO fridge_ingredients (username, ingredient, amount, unit) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = amount + ?, unit = ?`,
          [username, i.ingredient, i.amount, i.unit, i.amount, i.unit]
        )
      )
    );

    console.log(
      `Added ingredients to fridge for user ${username} successfully`
    );

    await this.deleteAll(username);

    console.log(
      `Deleted all recipes in shoppinglist for ${username} successfully`
    );

    return;
  }

  async bought(username: string, recipe_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      `SELECT ingredient, amount, unit FROM shopping_list_ingredients JOIN shopping_list ON id = shopping_list_id WHERE username = ? AND recipe_id = ?`,
      [username, recipe_id]
    );

    const boughtIngredient = results[0] as SimpleUnitIngredient;

    await pool.query(
      `INSERT INTO fridge_ingredients (username, ingredient, amount, unit) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = amount + ?, unit = ?`,
      [
        username,
        boughtIngredient.ingredient,
        boughtIngredient.amount,
        boughtIngredient.unit,
        boughtIngredient.amount,
        boughtIngredient.unit,
      ]
    );

    console.log(
      `Added ingredients to fridge for user ${username} and ${recipe_id} successfully`
    );

    await this.delete(username, recipe_id);

    console.log(`Deleted recipe in shoppinglist for ${username} successfully`);

    return;
  }
}

export const shoppinglistService = new ShoppinglistService();
