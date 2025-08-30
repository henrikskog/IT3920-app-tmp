import pool from "../../../mysql-pool.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  query_error,
  recipe,
  mocked_username,
  shopping_list_base,
  simple_ingredients,
} from "../../../testdata/mocktestdata.js";
import {
  mock_imageService,
  mock_recipeService,
} from "../../../testdata/mocks.js";
import { shoppinglistService } from "../../shoppinglistservice.js";

mock_imageService();

mock_recipeService();

describe("Shopping List Service unit test", () => {
  it("Should resolve getRecipes", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([[shopping_list_base] as RowDataPacket[], []]);

    await expect(
      shoppinglistService.getRecipes(mocked_username)
    ).resolves.toStrictEqual([shopping_list_base]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getRecipes", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(shoppinglistService.getRecipes(mocked_username)).rejects.toBe(
      query_error
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve getIngredients", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([simple_ingredients as RowDataPacket[], []]);

    await expect(
      shoppinglistService.getIngredients(shopping_list_base.recipe_id)
    ).resolves.toStrictEqual(simple_ingredients);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getIngredients", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      shoppinglistService.getIngredients(shopping_list_base.recipe_id)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve deleteAll", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([{} as ResultSetHeader, []]);

    await expect(
      shoppinglistService.deleteAll(mocked_username)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject deleteAll (No row deleted)", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([{ affectedRows: 0 } as ResultSetHeader, []]);

    await expect(
      shoppinglistService.deleteAll(mocked_username)
    ).rejects.toMatchObject(new Error("No row deleted"));
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject deleteAll", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(shoppinglistService.deleteAll(mocked_username)).rejects.toBe(
      query_error
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve delete", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([{} as ResultSetHeader, []]);

    await expect(
      shoppinglistService.delete(mocked_username, shopping_list_base.recipe_id)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject delete (No row deleted)", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([{ affectedRows: 0 } as ResultSetHeader, []]);

    await expect(
      shoppinglistService.delete(mocked_username, shopping_list_base.recipe_id)
    ).rejects.toMatchObject(new Error("No row deleted"));
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject delete", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      shoppinglistService.delete(mocked_username, shopping_list_base.recipe_id)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve create", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([{ insertId: 2 } as ResultSetHeader, []]);

    await expect(
      shoppinglistService.create(mocked_username, recipe.id)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(2);
  });
  it("Should reject create", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      shoppinglistService.create(mocked_username, recipe.id)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
