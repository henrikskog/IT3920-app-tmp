import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { ratingService } from "../../ratingservice.js";

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Rating Service integration test", () => {
  it("Should resolve getUserRating", async () => {
    await expect(
      ratingService.getUserRating(
        integrationdata.ratings[0][0].recipe_id,
        integrationdata.users[0].name
      )
    ).resolves.toStrictEqual([
      { rating: integrationdata.ratings[0][0].rating },
    ]);
  });
  it("Should reject getUserRating", async () => {
    await expect(
      // @ts-expect-error Value rejects promise
      ratingService.getUserRating([], integrationdata.users[0].name)
    ).rejects.toBeDefined();
  });
  it("Should resolve getAverage", async () => {
    await expect(
      ratingService
        .getAverage(integrationdata.recipes[0].id)
        // @ts-expect-error Rating is string from db when AVG
        .then((rl) => parseFloat(rl[0].rating))
    ).resolves.toBeCloseTo((3 + 2 + 2) / 3, 4);
  });
  it("Should reject getAverage", async () => {
    // @ts-expect-error Value rejects promise
    await expect(ratingService.getAverage([])).rejects.toBeDefined();
  });
  it("Should resolve create", async () => {
    await expect(
      ratingService.create(
        integrationdata.recipes[3].id,
        integrationdata.users[0].name,
        4
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject create", async () => {
    await expect(
      ratingService.create(
        integrationdata.recipes[3].id,
        integrationdata.users[0].name,
        4
      )
    ).rejects.toBeDefined();
  });
  it("Should resolve update", async () => {
    await expect(
      ratingService.update(
        integrationdata.recipes[3].id,
        integrationdata.users[0].name,
        5
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject update (No Rows Updated)", async () => {
    await expect(
      ratingService.update(
        integrationdata.recipes[4].id,
        integrationdata.users[0].name,
        5
      )
    ).rejects.toMatchObject(new Error("No row updated"));
  });
  it("Should reject update", async () => {
    // @ts-expect-error Value rejects promise
    await expect(ratingService.update([], [], [])).rejects.toBeDefined();
  });
  it("Should resolve delete", async () => {
    await expect(
      ratingService.delete(integrationdata.recipes[3].id,
        integrationdata.users[0].name,)
    ).resolves.toBeUndefined();
  });
  it("Should reject delete (No Rows Deleted)", async () => {
    await expect(
      ratingService.delete(integrationdata.recipes[3].id,
        integrationdata.users[0].name,)
    ).rejects.toMatchObject(new Error("No row deleted"));
  });
  it("Should reject delete", async () => {
    // @ts-expect-error Value rejects promise
    await expect(ratingService.delete([], [])).rejects.toBeDefined();
  });
});
