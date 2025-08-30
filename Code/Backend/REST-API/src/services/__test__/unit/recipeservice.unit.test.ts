import pool from "../../../mysql-pool.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { recipeService } from "../../recipeservice.js";
import {
  create_recipe,
  update_recipe,
  query_error,
  recipe,
  steps,
  unit_ingredients,
  mocked_username,
} from "../../../testdata/mocktestdata.js";
import { mock_imageService } from "../../../testdata/mocks.js";

mock_imageService();

describe("Recipe Service unit test", () => {
  it("Should resolve getAll", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([[recipe] as RowDataPacket[], []]);

    await expect(recipeService.getAll()).resolves.toStrictEqual([recipe]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getAll", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(recipeService.getAll()).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve get", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([[recipe] as RowDataPacket[], []]);

    await expect(recipeService.get(recipe.id)).resolves.toStrictEqual([recipe]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject get", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(recipeService.get(recipe.id)).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve create", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([{ insertId: recipe.id } as ResultSetHeader, []]);

    await expect(
      recipeService.create(mocked_username, create_recipe)
    ).resolves.toBe(recipe.id);
    expect(pool.query).toHaveBeenCalledTimes(3);
  });
  it("Should reject create", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      recipeService.create(mocked_username, create_recipe)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve update", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([[], []]);

    await expect(
      recipeService.update(mocked_username, recipe.id, update_recipe)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(
      Object.keys(update_recipe).length +
        // @ts-expect-error Ingredients is always defined
        update_recipe.ingredients?.length +
        // @ts-expect-error Recipe is always defined
        update_recipe.recipe?.length
    );
  });
  it("Should reject update", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      recipeService.update(mocked_username, recipe.id, update_recipe)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject update (No valid values)", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([{} as ResultSetHeader, []]);

    await expect(
      recipeService.update(mocked_username, recipe.id, {
        image_id: undefined,
        title: undefined,
        description: undefined,
        ingredients: [],
        recipe: [],
      })
    ).rejects.toMatchObject(new Error("No valid values"));
    expect(pool.query).not.toHaveBeenCalled();
  });
  it("Should resolve delete", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([{} as ResultSetHeader, []]);

    await expect(recipeService.delete(recipe.id)).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject delete", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(recipeService.delete(recipe.id)).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject deleted (No Rows Deleted)", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([{ affectedRows: 0 } as ResultSetHeader, []]);

    await expect(recipeService.delete(recipe.id)).rejects.toMatchObject(
      new Error("No row deleted")
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve getSteps", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([steps as RowDataPacket[], []]);

    await expect(recipeService.getSteps(recipe.id)).resolves.toStrictEqual(
      steps
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getSteps", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(recipeService.getSteps(recipe.id)).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve getIngredients", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([unit_ingredients as RowDataPacket[], []]);

    await expect(
      recipeService.getIngredients(recipe.id)
    ).resolves.toStrictEqual(unit_ingredients);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getIngredients", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(recipeService.getIngredients(recipe.id)).rejects.toBe(
      query_error
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
