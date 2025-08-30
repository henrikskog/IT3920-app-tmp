import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { fridgeService } from "../../fridgeservice.js";

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Fridge Service integration test", () => {
  it("Should resolve get", async () => {
    await expect(
      fridgeService.get(integrationdata.users[0].name)
    ).resolves.toMatchObject(
      integrationdata.fridge_ingredients[0].sort((a, b) =>
        a.ingredient.localeCompare(b.ingredient)
      )
    );
  });
  it("Should reject get", async () => {
    await expect(
      //@ts-expect-error Value that actually makes it reject
      fridgeService.get([])
    ).rejects.toBeDefined();
  });
  it("Should resolve create (new ingredient)", async () => {
    await expect(
      fridgeService.create(integrationdata.users[0].name, {
        ingredient: integrationdata.ingredients[3].ingredient,
        amount: 3,
        unit: integrationdata.ingredients[3].stdunits[0],
      })
    ).resolves.toBeUndefined();
  });
  it("Should resolve create (old ingredient)", async () => {
    await expect(
      fridgeService.create(integrationdata.users[0].name, {
        ingredient: integrationdata.ingredients[3].ingredient,
        amount: 3,
        unit: integrationdata.ingredients[3].stdunits[0],
      })
    ).resolves.toBeUndefined();
  });
  it("Should reject create", async () => {
    await expect(
      fridgeService.create(integrationdata.users[0].name, {
        ingredient: integrationdata.ingredients[3].ingredient,
        amount: -1,
        unit: integrationdata.ingredients[3].stdunits[0],
      })
    ).rejects.toBeDefined();
  });
  it("Should resolve update", async () => {
    await expect(
      fridgeService.update(integrationdata.users[0].name, {
        ingredient: integrationdata.ingredients[3].ingredient,
        amount: 5,
        unit: integrationdata.ingredients[3].stdunits[0],
      })
    ).resolves.toBeUndefined();
  });
  it("Should reject update", async () => {
    //@ts-expect-error Value that actually makes it reject
    await expect(fridgeService.update([], [])).rejects.toBeDefined();
  });
  it("Should reject update (No Rows Updated)", async () => {
    await expect(
      fridgeService.update(integrationdata.users[4].name, {
        ingredient: integrationdata.ingredients[3].ingredient,
        amount: 5,
        unit: integrationdata.ingredients[3].stdunits[0],
      })
    ).rejects.toMatchObject(new Error("No row updated"));
  });
  it("Should resolve delete", async () => {
    await expect(
      fridgeService.delete(
        integrationdata.users[0].name,
        integrationdata.fridge_ingredients[0][2].ingredient
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject delete", async () => {
    //@ts-expect-error Value that actually makes it reject
    await expect(fridgeService.delete([], [])).rejects.toBeDefined();
  });
  it("Should reject deleted (No Rows Deleted)", async () => {
    await expect(
      fridgeService.delete(
        integrationdata.users[0].name,
        integrationdata.fridge_ingredients[0][2].ingredient
      )
    ).rejects.toMatchObject(new Error("No row deleted"));
  });
});
