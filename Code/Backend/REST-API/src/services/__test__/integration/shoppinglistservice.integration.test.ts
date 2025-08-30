import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { shoppinglistService } from "../../shoppinglistservice.js";

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Shopping List Service integration test", () => {
  it("Should resolve getRecipes", async () => {
    await expect(
      shoppinglistService.getRecipes(integrationdata.users[0].name)
    ).resolves.toStrictEqual(
      integrationdata.shopping_list[0].map((s) => ({
        recipe_id: s.recipe.id,
        id: s.id,
      }))
    );
  });
  it("Should reject getRecipes", async () => {
    // @ts-expect-error Value rejects promise
    await expect(shoppinglistService.getRecipes([])).rejects.toBeDefined();
  });
  it("Should resolve getIngredients", async () => {
    await expect(
      shoppinglistService.getIngredients(
        integrationdata.shopping_list[0][0].recipe.id
      )
    ).resolves.toStrictEqual(
      integrationdata.shopping_list[0][0].ingredients.map((i) => ({
        amount: i.amount,
        ingredient: i.ingredient,
        unit: i.unit,
      }))
    );
  });
  it("Should reject getIngredients", async () => {
    await expect(
      // @ts-expect-error Value rejects promise
      shoppinglistService.getIngredients([])
    ).rejects.toBeDefined();
  });
  it("Should resolve deleteAll", async () => {
    await expect(
      shoppinglistService.deleteAll(integrationdata.users[0].name)
    ).resolves.toBeUndefined();
  });
  it("Should reject deleteAll (No row deleted)", async () => {
    await expect(
      shoppinglistService.deleteAll(integrationdata.users[0].name)
    ).rejects.toMatchObject(new Error("No row deleted"));
  });
  it("Should reject deleteAll", async () => {
    await expect(
      // @ts-expect-error Value rejects promise
      shoppinglistService.deleteAll([])
    ).rejects.toBeDefined();
  });
  it("Should resolve delete", async () => {
    await expect(
      shoppinglistService.delete(
        integrationdata.users[1].name,
        integrationdata.shopping_list[1][0].id
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject delete (No row deleted)", async () => {
    await expect(
      shoppinglistService.delete(
        integrationdata.users[1].name,
        integrationdata.shopping_list[1][0].id
      )
    ).rejects.toMatchObject(new Error("No row deleted"));
  });
  it("Should reject delete", async () => {
    // @ts-expect-error Value rejects promise
    await expect(shoppinglistService.delete([], [])).rejects.toBeDefined();
  });
  it("Should resolve create", async () => {
    await expect(
      shoppinglistService.create(
        integrationdata.users[1].name,
        integrationdata.shopping_list[1][0].recipe.id
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject create", async () => {
    await expect(
      // @ts-expect-error Value rejects promise
      shoppinglistService.create(integrationdata.users[1].name, null)
    ).rejects.toBeDefined();
  });
});
