import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import request from "supertest";
import pool from "../../../mysql-pool.js";
import { app } from "../../../app.js";
import { error_401 } from "../../../testdata/mocktestdata.js";

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

const usernameObj = { username: integrationdata.users[0].name };

describe("Login Router integration test", () => {
  it("GET /logins (200)", () => {
    return agent
      .get(`${baseURL}/logins`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(usernameObj).length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject(usernameObj);
      });
  });

  it("GET /logins (401)", () => {
    return request(app)
      .get(`${baseURL}/logins`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });

  it("POST /logins (201)", () => {
    return request(app)
      .post(`${baseURL}/logins`)
      .send({
        username: integrationdata.users[0].name,
        password: integrationdata.users[0].password,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(usernameObj).length.toString())
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject(usernameObj);
      });
  });

  it.each([
    { username: "", password: "" },
    { username: "User", password: "" },
  ])("POST /logins (400)", (baddata) => {
    const error = "Write a username and a password!";

    return agent
      .post(`${baseURL}/logins`)
      .send(baddata)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
      });
  });

  it("POST /logins (401)", () => {
    const error = "Login unsuccessful";
    const wrongLogin = {
      username: integrationdata.users[0].name,
      password: "cisco",
    };
    return request(app)
      .post(`${baseURL}/logins`)
      .send(wrongLogin)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("POST /logins (500)", () => {
    const error = "LOGIN ERROR";
    return request(app)
      .post(`${baseURL}/logins`)
      .send({
        username: "a",
        password: "A",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
      });
  });

  it("DELETE /logins (200)", () => {
    return agent
      .delete(`${baseURL}/logins`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
});
