import pool from "../../../mysql-pool.js";
import { RowDataPacket } from "mysql2";
import { image, query_error, recipe } from "../../../testdata/mocktestdata.js";
import { imageService } from "../../imageservice.js";

describe("Image Service unit test", () => {
  it("Should resolve get", async () => {
    jest
      .spyOn(pool, "query")
      .mockResolvedValue([[image] as RowDataPacket[], []]);

    await expect(imageService.get(recipe.image_id)).resolves.toStrictEqual([
      image,
    ]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject get", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(imageService.get(recipe.image_id)).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve create", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{ insertId: recipe.image_id }, []]);

    await expect(imageService.create(image)).resolves.toBe(recipe.image_id);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject create", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(imageService.create(image)).rejects.toBe(query_error);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("Should resolve update", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{}, []]);

    await expect(
      imageService.update(recipe.image_id, image)
    ).resolves.toBeUndefined();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject update", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(imageService.update(recipe.image_id, image)).rejects.toBe(
      query_error
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should reject updated (No Rows Updated)", async () => {
    jest
      .spyOn(pool, "query")
      // @ts-expect-error Only relevant mock values
      .mockResolvedValue([{ affectedRows: 0 }, []]);

    await expect(
      imageService.update(recipe.image_id, image)
    ).rejects.toMatchObject(new Error("No row updated"));
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
