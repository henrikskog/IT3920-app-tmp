import pool from "../../../mysql-pool.js";
import { RowDataPacket } from "mysql2";
import {
  mocked_username,
  query_error,
  recipe,
} from "../../../testdata/mocktestdata.js";
import { favoriteService } from "../../favoriteservice.js";

describe("Favorite Service unit test", () => {
  it("Should resolve getAll", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([[recipe] as RowDataPacket[], []]);

    await expect(
      favoriteService.getAll(mocked_username)
    ).resolves.toStrictEqual([recipe]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getAll", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(favoriteService.getAll(mocked_username)).rejects.toBe(
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
      favoriteService.create(mocked_username, recipe.id)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject create", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      favoriteService.create(mocked_username, recipe.id)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("Should resolve delete", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{}, []]);

    await expect(
      favoriteService.delete(mocked_username, recipe.id)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject delete", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      favoriteService.delete(mocked_username, recipe.id)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject deleted (No Rows Deleted)", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{ affectedRows: 0 }, []]);

    await expect(
      favoriteService.delete(mocked_username, recipe.id)
    ).rejects.toMatchObject(
      new Error(
        "No favorite recipe deleted for the specified username and recipeId."
      )
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
