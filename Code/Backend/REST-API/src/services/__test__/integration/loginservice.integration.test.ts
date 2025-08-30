import { IntegrationData, integrationdata } from "../../../testdata/integrationtestdata.js";
import pool from "../../../mysql-pool.js";
import { loginService } from "../../loginservice.js";

beforeAll(() => IntegrationData());

afterAll(() => pool.end());

describe("Login Service integration test", () => {
  it("Should resolve auth true", async () => {
    await expect(
      loginService.auth(
        integrationdata.users[0].name,
        integrationdata.users[0].password
      )
    ).resolves.toBeTruthy();
  });
  it("Should resolve auth false", async () => {
    await expect(
      loginService.auth(integrationdata.users[0].name, "Wrong Password")
    ).resolves.toBeFalsy();
  });
  it("Should reject auth", async () => {
    await expect(
      // @ts-expect-error Makes it reject
      loginService.auth([], "")
    ).rejects.toBeDefined();
  });
  it("Should resolve hash", async () => {
    await expect(
      loginService.hash(integrationdata.users[0].password)
    ).resolves.toBeDefined();
  });
  it("Should reject hash", async () => {
    await expect(
      // @ts-expect-error Testing for if value is invalid
      loginService.hash(undefined)
    ).rejects.toBeDefined();
  });
});
