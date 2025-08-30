import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { ingredientService } from "../../ingredientservice.js";

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Ingredient Service integration test", () => {
  it("Should resolve getAll", () => {
    return expect(ingredientService.getAll()).resolves.toMatchObject(
      integrationdata.ingredients.sort(function (a, b) {
        const textA = a.ingredient.toUpperCase().replace(/Å/g, "A");
        const textB = b.ingredient.toUpperCase().replace(/Å/g, "A");

        return textA.localeCompare(textB);
      })
    );
  });
  it("Should reject getAll", async () => {
    await pool.query(
      "INSERT INTO ingredients (ingredient, kcalper100gram, stdunits) VALUES (?, ?, ?)",
      ["Test", 3, "3,4]//"]
    );
    await expect(ingredientService.getAll()).rejects.toBeDefined();
    await pool.query("DELETE FROM ingredients WHERE ingredient = ?", ["Test"]);
  });
  it("Should resolve get", async () => {
    await expect(
      ingredientService.get(integrationdata.ingredients[0].ingredient)
    ).resolves.toStrictEqual([integrationdata.ingredients[0]]);
  });
  it("Should reject get", async () => {
    await pool.query(
      "INSERT INTO ingredients (ingredient, kcalper100gram, stdunits) VALUES (?, ?, ?)",
      ["Test", 3, "3,4]//"]
    );
    await expect(ingredientService.get("Test")).rejects.toBeDefined();
    await pool.query("DELETE FROM ingredients WHERE ingredient = ?", ["Test"]);
  });
  it("Should resolve create", async () => {
    await pool.query("DELETE FROM ingredients WHERE ingredient = ?", [
      integrationdata.ingredients[0].ingredient,
    ]);

    await expect(
      ingredientService.create(integrationdata.ingredients[0])
    ).resolves.toBeUndefined();
  });
  it("Should reject create", async () => {
    await expect(
      ingredientService.create(integrationdata.ingredients[0])
    ).rejects.toBeDefined();
  });
});
