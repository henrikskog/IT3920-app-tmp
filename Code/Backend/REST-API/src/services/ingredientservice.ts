import pool from "../mysql-pool.js";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { Ingredient, SQLIngredient } from "../types.js";

class IngredientService {
  async getAll() {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM ingredients"
    );
    console.log(`Retrieved all ingredients successfully: `, results);

    const formatResults: Ingredient[] = (results as SQLIngredient[]).map(
      (i) => ({
        ...i,
        stdunits: JSON.parse(i.stdunits),
      })
    );
    return formatResults;
  }

  async get(ingredient: string) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM ingredients WHERE ingredient = ?",
      [ingredient]
    );

    const formatResults: Ingredient[] = (results as SQLIngredient[]).map(
      (i) => ({
        ...i,
        stdunits: JSON.parse(i.stdunits),
      })
    );
    return formatResults;
  }

  async create(ingredient: Ingredient) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "INSERT INTO ingredients (ingredient, kcalper100gram, stdunits) VALUES (?, ?, ?)",
      [
        ingredient.ingredient,
        ingredient.kcalper100gram,
        JSON.stringify(ingredient.stdunits),
      ]
    );
    console.log(
      `Created ingredient with name:${results.insertId} successfully`
    );

    return;
  }
}

export const ingredientService = new IngredientService();
