import pool from "../../../mysql-pool.js";
import { RowDataPacket } from "mysql2";
import {
  mocked_hash,
  mocked_login,
  query_error,
} from "../../../testdata/mocktestdata.js";
import { loginService } from "../../loginservice.js";
import bcrypt from "bcrypt";

const compare_spy = jest.spyOn(bcrypt, "compare");
const genSalt_spy = jest.spyOn(bcrypt, "genSalt");
const hash_spy = jest.spyOn(bcrypt, "hash");

describe("Login Service unit test", () => {
  it.each([mocked_login.password, mocked_hash, ""])(
    "Should resolve auth",
    async (password) => {
      jest
        .spyOn(pool, "query")
        .mockResolvedValue([
          [{ password: await loginService.hash(password) }] as RowDataPacket[],
          [],
        ]);

      await expect(
        loginService.auth(mocked_login.username, mocked_login.password)
      ).resolves.toBe(password == mocked_login.password);
      expect(compare_spy).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledTimes(1);
    }
  );
  it("Should reject auth", async () => {
    jest.spyOn(pool, "query").mockRejectedValue(query_error);

    await expect(
      loginService.auth(mocked_login.username, mocked_login.password)
    ).rejects.toBe(query_error);
    expect(compare_spy).not.toHaveBeenCalled();
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
  it("Should resolve hash", async () => {
    await expect(
      loginService.hash(mocked_login.password)
    ).resolves.toBeDefined();
    expect(genSalt_spy).toHaveBeenCalledTimes(1);
    expect(hash_spy).toHaveBeenCalledTimes(1);
  });
  it("Should reject hash", async () => {
    await expect(
      // @ts-expect-error Testing for if value is invalid
      loginService.hash(undefined)
    ).rejects.toBeDefined();
    expect(genSalt_spy).toHaveBeenCalledTimes(1);
    expect(hash_spy).toHaveBeenCalledTimes(1);
  });
});
