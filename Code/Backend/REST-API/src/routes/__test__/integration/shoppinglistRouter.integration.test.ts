import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import request from "supertest";
import pool from "../../../mysql-pool.js";
import { app } from "../../../app.js";
import { restartFunc } from "../../../sqlCommands.js";
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

describe("ShoppingList Router integration test", () => {
  it("GET /shoppinglist (200)", () => {
    const expected = integrationdata.shopping_list[0].map((s) => ({
      ...s,
      recipe: { ...s.recipe, date: s.recipe.date.toISOString() },
      ingredients: s.ingredients
        .sort((a, b) => a.ingredient.localeCompare(b.ingredient))
        .map((i) => ({
          ingredient: i.ingredient,
          amount: i.amount,
          unit: i.unit,
        })),
    }));
    return agent
      .get(`${baseURL}/shoppinglist`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        "Content-Length",
        (JSON.stringify(expected).length + 2).toString()
      )
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expected);
      });
  });
  it("GET /shoppinglists (401)", () => {
    return request(app)
      .get(`${baseURL}/shoppinglist`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("GET /shoppinglists (500)", async () => {
    const error = "Failed to get shopping list data";
    await restartFunc();
    await agent
      .get(`${baseURL}/shoppinglist`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
    await IntegrationData();
  });
  it("POST /shoppinglists (201)", () => {
    return agent
      .post(`${baseURL}/shoppinglist`)
      .send({ recipe_id: 1 })
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("POST /shoppinglists (401)", () => {
    return request(app)
      .post(`${baseURL}/shoppinglist`)
      .send({ recipe_id: 1 })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("POST /shoppinglists (500)", () => {
    const error = "Failed to create shoppinglist";

    return agent
      .post(`${baseURL}/shoppinglist`)
      .send({ recipe_id: null })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("DELETE /shoppinglists/:shopping_list_id (200)", () => {
    return agent
      .delete(
        `${baseURL}/shoppinglist/${integrationdata.shopping_list[0][0].id}`
      )
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("DELETE /shoppinglists/:shopping_list_id (401)", () => {
    return request(app)
      .delete(
        `${baseURL}/shoppinglist/${integrationdata.shopping_list[0][0].id}`
      )
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("DELETE /shoppinglists/:shopping_list_id (500)", () => {
    const error = "Failed to delete shoppinglist";

    return agent
      .delete(
        `${baseURL}/shoppinglist/${integrationdata.shopping_list[0][0].id}`
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
