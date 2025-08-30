import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import { app } from "../../../app.js";
import pool from "../../../mysql-pool.js";
import request from "supertest";
import { error_401 } from "../../../testdata/mocktestdata.js";
import { DisplayRecipe } from "../../../types.js";
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

describe("Favorite Router integration test", () => {
  it("GET /favorites (200)", () => {
    const returnValue = integrationdata.favorites[0].map((f) =>
      integrationdata.displayrecipes.find((r) => r.id == f.recipe_id)
    );
    console.log(returnValue, JSON.stringify(returnValue, null, 2));
    return agent
      .get(`${baseURL}/favorites`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        "Content-Length",
        `"${JSON.stringify(returnValue)}"`.length.toString()
      )
      .expect(200)
      .then((response: { body: DisplayRecipe[] }) => {
        expect(
          response.body.map((r) => ({ ...r, date: new Date(r.date) }))
        ).toMatchObject(returnValue);
      });
  });
  it("GET /favorites (401)", () => {
    return request(app)
      .get(`${baseURL}/favorites`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("GET /favorites (500)", async () => {
    const error = "Error getting all favorites";
    await restartFunc();
    await agent
      .get(`${baseURL}/favorites`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
    await IntegrationData();
  });
  it("POST /favorites (201)", () => {
    return agent
      .post(`${baseURL}/favorites`)
      .send({ recipe_id: integrationdata.recipes[3].id })
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("POST /favorites (401)", () => {
    return request(app)
      .post(`${baseURL}/favorites`)
      .send({ recipe_id: integrationdata.recipes[3].id })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("POST /favorites (500)", () => {
    const error = "Failed to create favorite";
    return agent
      .post(`${baseURL}/favorites`)
      .send({ recipe_id: integrationdata.recipes[3].id })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("GET /favorites/recipes/:recipe_id (200)", () => {
    return agent
      .get(`${baseURL}/favorites/recipes/${integrationdata.recipes[2].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        "Content-Length",
        JSON.stringify([integrationdata.favorites[0][2]]).length.toString()
      )
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual([integrationdata.favorites[0][2]]);
      });
  });
  it("GET /favorites/recipes/:recipe_id (401)", () => {
    return request(app)
      .get(`${baseURL}/favorites/recipes/${integrationdata.recipes[2].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("GET /favorites/recipes/:recipe_id (404)", () => {
    return agent
      .get(`${baseURL}/favorites/recipes/${-1}`)
      .set("Accept", "application/json")
      .expect(404)
      .then((response) => {
        expect(response.text).toStrictEqual("");
      });
  });
  it("GET /favorites/recipes/:recipe_id (500)", () => {
    const error = "Failed to get favorite";
    return agent
      .get(`${baseURL}/favorites/recipes/${null}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("DELETE /favorites/recipes/:recipe_id (200)", () => {
    return agent
      .delete(`${baseURL}/favorites/recipes/${integrationdata.recipes[3].id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("DELETE /favorites/recipes/:recipe_id (401)", () => {
    return request(app)
      .delete(`${baseURL}/favorites/recipes/${integrationdata.recipes[3].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("DELETE /favorites/recipes/:recipe_id (500)", () => {
    const error = "Failed to delete favorite";
    return agent
      .delete(`${baseURL}/favorites/recipes/${-1}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
});
