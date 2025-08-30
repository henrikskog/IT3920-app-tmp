import pool from "../mysql-pool.js";
import type { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2/promise";
import {
  DisplayRecipe,
  RecipeCreate,
  RecipeUpdate,
  Step,
  UnitIngredient,
} from "../types.js";
import { ratingService } from "./ratingservice.js";

class RecipeService {
  async getAll() {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM recipes"
    );

    console.log(`Retrieved all recipes successfully: `);
    return results as DisplayRecipe[];
  }

  // Returns array to show if it is found or not
  async get(recipe_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM recipes WHERE id = ?",
      [recipe_id]
    );
    console.log(`Retrieved recipe successfully: `, results);
    return results as DisplayRecipe[];
  }

  async create(username: string, recipe: RecipeCreate) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "INSERT INTO recipes (username, title, description, image_id) VALUES (?, ?, ?, ?)",
      [username, recipe.title, recipe.description, recipe.image_id]
    );
    const recipe_id = results.insertId;
    console.log(`Created recipe with id:${recipe_id} successfully`);

    await pool.query(
      "INSERT INTO recipe_steps (recipe_id, step, instruction) VALUES ?",
      [recipe.recipe.map((r) => [recipe_id, r.step, r.instruction])]
    );
    console.log(`Created steps from recipe_id:${recipe_id} successfully`);

    await pool.query(
      "INSERT INTO recipe_ingredients (recipe_id, ingredient, amount, unit) VALUES ?",
      [
        recipe.ingredients.map((i) => [
          recipe_id,
          i.ingredient,
          i.amount,
          i.unit,
        ]),
      ]
    );
    console.log(`Created ingredients from recipe_id:${recipe_id} successfully`);

    return recipe_id;
  }

  async update(
    username: string,
    recipe_id: number,
    { title, description, ingredients, recipe, image_id }: RecipeUpdate
  ) {
    if ( 
      !(
        image_id ||
        title ||
        description ||
        ingredients?.length ||
        recipe?.length
      )
    )
      throw new Error("No valid values"); 

    if (title)
      await pool.query(
        `UPDATE recipes SET title = ? WHERE id = ? AND username = ?`,
        [title, recipe_id, username]
      );

    if (description)
      await pool.query(
        `UPDATE recipes SET description = ? WHERE id = ? AND username = ?`,
        [description, recipe_id, username]
      );

    if (image_id)
      await pool.query(
        `UPDATE recipes SET image_id = ? WHERE id = ? AND username = ?`,
        [image_id, recipe_id, username]
      );

    if (ingredients?.length) {
      await pool.query(
        "DELETE FROM recipe_ingredients WHERE recipe_id = ? AND ingredient NOT IN (?)",
        [recipe_id, ingredients.map(({ ingredient }) => ingredient)]
      );
      await Promise.all(
        ingredients.map(({ ingredient, amount, unit }) =>
          pool.query(
            "INSERT INTO recipe_ingredients (recipe_id, ingredient, amount, unit) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = ?, unit = ?",
            [recipe_id, ingredient, amount, unit, amount, unit]
          )
        )
      );
    }

    if (recipe?.length) {
      await pool.query(
        "DELETE FROM recipe_steps WHERE recipe_id = ? AND step > ?",
        [recipe_id, recipe.length]
      );
      await Promise.all(
        recipe.map(({ step, instruction }) =>
          pool.query(
            "INSERT INTO recipe_steps (recipe_id, step, instruction) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE instruction = ?",
            [recipe_id, step, instruction, instruction]
          )
        )
      );
    }

    return;
  }

  async delete(recipe_id: number) {
    const [results]: [ResultSetHeader, FieldPacket[]] = await pool.query(
      "DELETE FROM recipes WHERE id = ?",
      [recipe_id]
    );

    if (results.affectedRows == 0) throw new Error("No row deleted");

    console.log(`Deleted recipe with id:${recipe_id} successfully`);

    return;
  }

  async getSteps(recipe_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT step, instruction FROM recipe_steps WHERE recipe_id = ?",
      [recipe_id]
    );

    console.log(`Retrieved recipe steps successfully:`, results);
    return results as Step[];
  }

  async getIngredients(recipe_id: number) {
    const [results]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT ingredients.*, amount, unit FROM recipe_ingredients JOIN ingredients ON recipe_ingredients.ingredient = ingredients.ingredient WHERE recipe_id = ?",
      [recipe_id]
    );
    console.log("Retrieved recipe ingredients successfully:", results);

    return results as UnitIngredient[];
  }

  async getRating(recipe_id: number) {
    return await ratingService.getAverage(recipe_id);
  }
}

export const recipeService = new RecipeService();
