import pool from "../mysql-pool.js";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { UnitIngredient, SimpleUnitIngredient } from "../types.js";

class FridgeService {
  // Gets all the ingredients from fridge
  async get(username: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT ingredients.*, fridge_ingredients.amount, fridge_ingredients.unit FROM fridge_ingredients JOIN ingredients ON fridge_ingredients.ingredient = ingredients.ingredient WHERE username = ?",
      [username]
    );

    console.log(`Retrieved fridge successfully: `, results);
    const formatResults: UnitIngredient[] = (results as UnitIngredient[]).map(
      (i) => ({
        ...i,
        // @ts-expect-error It is a string when arriving
        stdunits: JSON.parse(i.stdunits),
      })
    );
    return formatResults;
  }

  // adds ingredient(s) to the fridge
  async create(username: string, ingredientRequests: SimpleUnitIngredient) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "INSERT INTO fridge_ingredients (username, ingredient, amount, unit) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = amount + ?",
      [
        username,
        ingredientRequests.ingredient,
        ingredientRequests.amount,
        ingredientRequests.unit,
        ingredientRequests.amount,
      ]
    );
    console.log(`Added ingredient to fridge: `, results);

    return;
  }

  // modifies ingredient in fridge
  async update(username: string, ingredientRequest: SimpleUnitIngredient) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "UPDATE fridge_ingredients SET amount = ? WHERE username = ? AND ingredient = ?",
      [ingredientRequest.amount, username, ingredientRequest.ingredient]
    );

    if (results.affectedRows == 0) throw new Error("No row updated");
    console.log(`Updated fridge successfully`);

    return;
  }

  // deletes ingredient from fridge
  async delete(username: string, ingredient: string) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "DELETE FROM fridge_ingredients WHERE username = ? AND ingredient = ?",
      [username, ingredient]
    );
    if (results.affectedRows == 0) throw new Error("No row deleted");
    console.log(`Deleted ingredient successfully`);

    return;
  }
}

export const fridgeService = new FridgeService();
