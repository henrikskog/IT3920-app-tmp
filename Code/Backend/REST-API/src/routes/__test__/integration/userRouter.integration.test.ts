import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import request from "supertest";
import pool from "../../../mysql-pool.js";
import { app } from "../../../app.js";

const agent = request.agent(app);

const baseURL = "/api/v1";

beforeAll(async () => {
  await IntegrationData();
  await agent
    .post(`${baseURL}/logins`)
    .send({
      username: integrationdata.users[0].name,
      password: integrationdata.users[0].password,
    })
    .set("Accept", "application/json");
});

afterAll(() => pool.end());

describe("User Router integration test", () => {
  it("POST /users (201)", () => {
    return agent
      .post(`${baseURL}/users`)
      .send({ name: "Test", password: "12345", image_id: 1 })
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it.each([
    { image_id: 1, username: "Some name" },
    { image_id: 1, password: "Some password" },
    { username: "Some name", password: "Some password" },
  ])("POST /users (400)", (baddata) => {
    const error = "image, name or password was not sent";

    return agent
      .post(`${baseURL}/users`)
      .send(baddata)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
      });
  });

  it("POST /users (500)", () => {
    const error = "Failed to create user";
    return agent
      .post(`${baseURL}/users`)
      .send(integrationdata.users[0])
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
      });
  });
});
