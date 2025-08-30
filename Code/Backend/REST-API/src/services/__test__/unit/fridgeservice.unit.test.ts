import { fridgeService } from "../../fridgeservice.js";
import pool from "../../../mysql-pool.js";
import { SimpleUnitIngredient } from "../../../types.js";
import { RowDataPacket } from "mysql2";
import {
  mocked_username,
  query_error,
  simple_ingredients,
  unit_ingredients,
} from "../../../testdata/mocktestdata.js";

const simple_ingredient: SimpleUnitIngredient = simple_ingredients[0];

describe("Fridge Service unit test", () => {
  it("Should resolve get", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([
      unit_ingredients.map((i) => ({
        ...i,
        stdunits: JSON.stringify(i.stdunits),
      })) as RowDataPacket[],
      [],
    ]);

    await expect(fridgeService.get(mocked_username)).resolves.toStrictEqual(
      unit_ingredients
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject get", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(fridgeService.get(mocked_username)).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve create", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{}, []]);

    await expect(
      fridgeService.create(mocked_username, simple_ingredient)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject create", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      fridgeService.create(mocked_username, simple_ingredient)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve update", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{}, []]);

    await expect(
      fridgeService.update(mocked_username, simple_ingredient)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject update", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      fridgeService.update(mocked_username, simple_ingredient)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject update (No Rows Updated)", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{ affectedRows: 0 }, []]);

    await expect(
      fridgeService.update(mocked_username, simple_ingredient)
    ).rejects.toMatchObject(new Error("No row updated"));
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve delete", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{}, []]);

    await expect(
      fridgeService.delete(mocked_username, simple_ingredient.ingredient)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject delete", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      fridgeService.delete(mocked_username, simple_ingredient.ingredient)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject deleted (No Rows Deleted)", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{ affectedRows: 0 }, []]);

    await expect(
      fridgeService.delete(mocked_username, simple_ingredient.ingredient)
    ).rejects.toMatchObject(new Error("No row deleted"));
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
