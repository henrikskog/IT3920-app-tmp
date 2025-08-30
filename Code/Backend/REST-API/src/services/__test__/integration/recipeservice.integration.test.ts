import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { recipeService } from "../../recipeservice.js";
import { restartFunc } from "../../../sqlCommands.js";

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Recipe Service integration test", () => {
  it("Should resolve getAll", async () => {
    await expect(recipeService.getAll()).resolves.toStrictEqual(
      integrationdata.displayrecipes
    );
  });
  it("Should reject getAll", async () => {
    await restartFunc();
    await expect(recipeService.getAll()).rejects.toBeDefined();
    await IntegrationData();
  });
  it("Should resolve get", async () => {
    await expect(
      recipeService.get(integrationdata.recipes[0].id)
    ).resolves.toStrictEqual([integrationdata.displayrecipes[0]]);
  });
  it("Should reject get", async () => {
    // @ts-expect-error Value to reject promise
    await expect(recipeService.get([])).rejects.toBeDefined();
  });
  it("Should resolve create", async () => {
    await expect(
      recipeService.create(
        integrationdata.users[0].name,
        integrationdata.recipes[5]
      )
    ).resolves.toBe(integrationdata.recipes[9].id + 1);
  });
  it("Should reject create", async () => {
    await expect(
      // @ts-expect-error Value to reject promise
      recipeService.create([], [])
    ).rejects.toBeDefined();
  });
  it("Should resolve update", async () => {
    await expect(
      recipeService.update(
        integrationdata.users[0].name,
        integrationdata.recipes[9].id + 1,
        integrationdata.recipes[4]
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject update", async () => {
    await expect(
      recipeService.update(
        integrationdata.users[0].name,
        integrationdata.recipes[9].id + 1,
        // @ts-expect-error Value to reject promise
        { title: [] }
      )
    ).rejects.toBeDefined();
  });
  it("Should reject update (No Valid Values)", async () => {
    await expect(
      recipeService.update(
        integrationdata.users[0].name,
        integrationdata.recipes[9].id + 1,
        { ingredients: [], recipe: [] }
      )
    ).rejects.toMatchObject(new Error("No valid values"));
  });
  it("Should resolve delete", async () => {
    await expect(
      recipeService.delete(integrationdata.recipes[9].id + 1)
    ).resolves.toBeUndefined();
  });
  it("Should reject delete", async () => {
    // @ts-expect-error Value to reject promise
    await expect(recipeService.delete(null)).rejects.toBeDefined();
  });
  it("Should reject deleted (No Rows Deleted)", async () => {
    await expect(
      recipeService.delete(integrationdata.recipes[9].id + 1)
    ).rejects.toMatchObject(new Error("No row deleted"));
  });
  it("Should resolve getSteps", async () => {
    await expect(
      recipeService.getSteps(integrationdata.recipes[0].id)
    ).resolves.toStrictEqual(integrationdata.recipes[0].recipe);
  });
  it("Should reject getSteps", async () => {
    // @ts-expect-error Value to reject promise
    await expect(recipeService.getSteps([])).rejects.toBeDefined();
  });
  it("Should resolve getIngredients", async () => {
    await expect(
      recipeService.getIngredients(integrationdata.recipes[0].id).then((il) =>
        // @ts-expect-error Value to reject promise
        il.map((i) => ({ ...i, stdunits: JSON.parse(i.stdunits) }))
      )
    ).resolves.toStrictEqual(integrationdata.recipes[0].ingredients);
  });
  it("Should reject getIngredients", async () => {
    // @ts-expect-error Value to reject promise
    await expect(recipeService.getIngredients([])).rejects.toBeDefined();
  });
  it("Should resolve getRating", async () => {
    await expect(
      recipeService
        .getRating(integrationdata.recipes[0].id)
        // @ts-expect-error Rating is string from db when AVG
        .then((rl) => parseFloat(rl[0].rating))
    ).resolves.toBeCloseTo((3 + 2 + 2) / 3, 4);
  });
  it("Should reject getRating", async () => {
    // @ts-expect-error Value rejects promise
    await expect(recipeService.getRating([])).rejects.toBeDefined();
  });
});
