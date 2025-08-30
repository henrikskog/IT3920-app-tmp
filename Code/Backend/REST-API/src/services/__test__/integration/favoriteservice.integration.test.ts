import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { favoriteService } from "../../favoriteservice.js";

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Favorite Service integration test", () => {
  it("Should resolve getAll", async () => {
    await expect(
      favoriteService.getAll(integrationdata.users[0].name)
    ).resolves.toStrictEqual(
      integrationdata.displayrecipes.filter((r) =>
        integrationdata.favorites[0].some((f) => f.recipe_id == r.id)
      )
    );
  });
  it("Should reject getAll", async () => {
    //@ts-expect-error Value that actually makes it reject
    await expect(favoriteService.getAll([])).rejects.toBeDefined();
  });
  it("Should resolve create", async () => {
    await expect(
      favoriteService.create(
        integrationdata.users[0].name,
        integrationdata.displayrecipes[8].id
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject create", async () => {
    await expect(
      favoriteService.create(
        integrationdata.users[0].name,
        integrationdata.displayrecipes[8].id
      )
    ).rejects.toBeDefined();
  });

  it("Should resolve get", async () => {
    await expect(
      favoriteService.get(
        integrationdata.users[0].name,
        integrationdata.favorites[0][1].recipe_id
      )
    ).resolves.toStrictEqual([integrationdata.favorites[0][1]]);
  });
  it("Should reject get", async () => {
    //@ts-expect-error Value that actually makes it reject
    await expect(favoriteService.get([], [])).rejects.toBeDefined();
  });

  it("Should resolve delete", async () => {
    await expect(
      favoriteService.delete(
        integrationdata.users[0].name,
        integrationdata.displayrecipes[8].id
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject delete", async () => {
    await expect(
      //@ts-expect-error Value that actually makes it reject
      favoriteService.delete([], [])
    ).rejects.toBeDefined();
  });
  it("Should reject deleted (No Rows Deleted)", async () => {
    await expect(
      favoriteService.delete(
        integrationdata.users[0].name,
        integrationdata.displayrecipes[8].id
      )
    ).rejects.toMatchObject(
      new Error(
        "No favorite recipe deleted for the specified username and recipeId."
      )
    );
  });
});
