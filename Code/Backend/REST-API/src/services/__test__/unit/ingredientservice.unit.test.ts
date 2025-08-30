import { ingredientService } from "../../ingredientservice.js";
import pool from "../../../mysql-pool.js";
import { RowDataPacket } from "mysql2";
import { ingredients, query_error, sql_ingredients } from "../../../testdata/mocktestdata.js";

describe("Ingredient Service unit test", () => {
  it("Should resolve getAll", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([sql_ingredients as RowDataPacket[], []]);

    await expect(ingredientService.getAll()).resolves.toStrictEqual(
      ingredients
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getAll", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(ingredientService.getAll()).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve get", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([sql_ingredients as RowDataPacket[], []]);

    await expect(
      ingredientService.get(ingredients[0].ingredient)
    ).resolves.toStrictEqual(ingredients);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject get", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(ingredientService.get(ingredients[0].ingredient)).rejects.toBe(
      query_error
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve create", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{}, []]);

    await expect(
      ingredientService.create(ingredients[0])
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject create", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(ingredientService.create(ingredients[0])).rejects.toBe(
      query_error
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
