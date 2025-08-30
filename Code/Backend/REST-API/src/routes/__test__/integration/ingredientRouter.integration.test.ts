import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import request from "supertest";
import pool from "../../../mysql-pool.js";
import { app } from "../../../app.js";
import { restartFunc } from "../../../sqlCommands.js";

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

describe("Ingredient Router integration test", () => {
  it("GET /ingredients (200)", () => {
    const expected = integrationdata.ingredients.sort((a, b) =>
      a.ingredient.localeCompare(b.ingredient)
    );
    return agent
      .get(`${baseURL}/ingredients`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(expected).length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(expected);
      });
  });

  it("GET /ingredients (500)", async () => {
    const error = "Error getting all ingredients";
    await pool.query(
      "INSERT INTO ingredients (ingredient, kcalper100gram, stdunits) VALUES (?, ?, ?)",
      ["TEST", 100, "'HUHUHUHUH', 'iahejifhiaehf'"]
    );
    await agent
      .get(`${baseURL}/ingredients`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
    await IntegrationData();
  });

  it("POST /ingredients (200)", async () => {
    await pool.query(
      "DELETE FROM ingredients WHERE ingredient = ?",
      integrationdata.ingredients[0].ingredient
    );
    return agent
      .post(`${baseURL}/ingredients`)
      .send(integrationdata.ingredients[0])
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it("POST /ingredients (500)", () => {
    const error = "Failed to create ingredient";

    return agent
      .post(`${baseURL}/ingredients`)
      .send(integrationdata.ingredients[0])
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("GET /ingredients/:ingredient (200)", () => {
    const expected = integrationdata.ingredients[0];
    return agent
      .get(`${baseURL}/ingredients/${expected.ingredient}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(expected).length.toString())
      .expect(200)
      .then((response) => expect(response.body).toMatchObject(expected));
  });

  it("GET /ingredients/:ingredient (404)", () => {
    const error = "Error getting ingredient";

    return agent
      .get(`${baseURL}/ingredients/a`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(404)
      .then((response) => expect(response.text).toBe(error));
  });

  it("GET /ingredients/:ingredient (500)", async () => {
    const error = "Error getting all ingredients";
    await restartFunc();
    await agent
      .get(
        `${baseURL}/ingredients/${integrationdata.ingredients[0].ingredient}`
      )
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
});
