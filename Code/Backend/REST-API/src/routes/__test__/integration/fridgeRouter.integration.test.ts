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
    .post(`/api/v1/logins`)
    .send({
      username: integrationdata.users[0].name,
      password: integrationdata.users[0].password,
    })
    .set("Accept", "application/json");
});

afterAll(() => pool.end());

describe("Fridge Router integration test", () => {
  it("GET /fridges/:username (200)", () => {
    return agent
      .get(`${baseURL}/fridges/${integrationdata.users[0].name}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        "Content-Length",
        JSON.stringify(integrationdata.fridge_ingredients[0]).length.toString()
      )
      .expect(200)
      .then((response) =>
        expect(response.body).toStrictEqual(
          integrationdata.fridge_ingredients[0].sort((a, b) =>
            a.ingredient.localeCompare(b.ingredient)
          )
        )
      );
  });
  it("GET /fridges/:username (500)", async () => {
    const error = "Error getting fridge ingredients";
    await restartFunc();
    await agent
      .get(`${baseURL}/fridges/${integrationdata.users[0].name}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
    await IntegrationData();
  });

  it("POST /fridges/:username (200) (New ingredient)", () => {
    return agent
      .post(`${baseURL}/fridges/${integrationdata.users[0].name}`)
      .send(integrationdata.fridge_ingredients[1])
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it("POST /fridges/:username (200) (Existing ingredient)", () => {
    return agent
      .post(`${baseURL}/fridges/${integrationdata.users[0].name}`)
      .send(integrationdata.fridge_ingredients[0])
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it("POST /fridges/:username (500)", () => {
    const error = "Failed to add ingredient to fridge";

    return agent
      .post(`${baseURL}/fridges/${integrationdata.users[0].name}`)
      .send(integrationdata.fridge_ingredients[0][0])
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("PATCH /fridges/:username (200)", () => {
    return agent
      .patch(`${baseURL}/fridges/${integrationdata.users[0].name}`)
      .send(integrationdata.fridge_ingredients[0])
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it("PATCH /fridges/:username (500)", () => {
    const error = "Failed to update fridge ingredient";

    return agent
      .patch(`${baseURL}/fridges/${integrationdata.users[0].name}`)
      .send(integrationdata.fridge_ingredients[2])
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("DELETE /fridges/:username (200)", () => {
    return agent
      .delete(
        `${baseURL}/fridges/${integrationdata.users[0].name}/ingredients/${integrationdata.fridge_ingredients[0][0].ingredient}`
      )
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it("DELETE /fridges/:username/ingredients/:ingredient (500)", () => {
    const error = "Failed to delete fridge ingredient";

    return agent
      .delete(
        `${baseURL}/fridges/${integrationdata.users[0].name}/ingredients/${integrationdata.fridge_ingredients[0][0].ingredient}`
      )
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
});
