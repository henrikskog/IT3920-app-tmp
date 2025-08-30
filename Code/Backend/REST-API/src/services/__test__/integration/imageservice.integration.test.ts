import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { imageService } from "../../imageservice.js";

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Image Service integration test", () => {
  it("Should resolve get", () => {
    return expect(
      imageService.get(integrationdata.recipes[0].image_id)
    ).resolves.toMatchObject([integrationdata.images[0]]);
  });
  it("Should reject get", () => {
    // @ts-expect-error Value rejects promise
    return expect(imageService.get([])).rejects.toBeDefined();
  });
  it("Should resolve create", () => {
    return expect(imageService.create(integrationdata.images[0])).resolves.toBe(
      integrationdata.images.length + 1
    );
  });
  it("Should reject create", () => {
    // @ts-expect-error Value rejects promise
    return expect(imageService.create([])).rejects.toBeDefined();
  });

  it("Should resolve update", () => {
    return expect(
      imageService.update(
        integrationdata.recipes[0].image_id,
        integrationdata.images[1]
      )
    ).resolves.toBeUndefined();
  });
  it("Should reject update", () => {
    return expect(
      // @ts-expect-error Value rejects promise
      imageService.update([], [])
    ).rejects.toBeDefined();
  });
  it("Should reject updated (No Rows Updated)", () => {
    return expect(
      imageService.update(-1, integrationdata.images[0])
    ).rejects.toMatchObject(new Error("No row updated"));
  });
});
