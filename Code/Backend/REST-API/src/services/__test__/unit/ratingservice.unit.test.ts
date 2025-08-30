import pool from "../../../mysql-pool.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { mocked_username, query_error, rating, recipe } from "../../../testdata/mocktestdata.js";
import { ratingService } from "../../ratingservice.js";

describe("Rating Service unit test", () => {
  it("Should resolve getUserRating", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([[rating] as RowDataPacket[], []]);

    await expect(
      ratingService.getUserRating(recipe.id, mocked_username)
    ).resolves.toStrictEqual([rating]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getUserRating", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      ratingService.getUserRating(recipe.id, mocked_username)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve getAverage", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([[rating] as RowDataPacket[], []]);

    await expect(ratingService.getAverage(recipe.id)).resolves.toStrictEqual([
      rating,
    ]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject getAverage", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(ratingService.getAverage(recipe.id)).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve create", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([{} as ResultSetHeader, []]);

    await expect(
      ratingService.create(recipe.id, mocked_username, rating.rating)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject create", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      ratingService.create(recipe.id, mocked_username, rating.rating)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve update", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([{} as ResultSetHeader, []]);

    await expect(
      ratingService.update(recipe.id, mocked_username, rating.rating)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject update (No Rows Updated)", async () => {

    jest
      .spyOn(pool, "query")
      .mockResolvedValue([{ affectedRows: 0 } as ResultSetHeader, []]);

    await expect(
      ratingService.update(recipe.id, mocked_username, rating.rating)
    ).rejects.toMatchObject(new Error("No row updated"));
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject update", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      ratingService.update(recipe.id, mocked_username, rating.rating)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve delete", async () => {
    jest.spyOn(pool, "query").mockResolvedValue([{} as ResultSetHeader, []]);

    await expect(
      ratingService.delete(recipe.id, mocked_username)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject delete (No Rows Deleted)", async () => {

    jest
      .spyOn(pool, "query")
      .mockResolvedValue([{ affectedRows: 0 } as ResultSetHeader, []]);

    await expect(
      ratingService.delete(recipe.id, mocked_username)
    ).rejects.toMatchObject(new Error("No row deleted"));
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject delete", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      ratingService.delete(recipe.id, mocked_username)
    ).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
