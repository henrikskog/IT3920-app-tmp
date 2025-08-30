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

describe("Recipe Router integration test", () => {
  it("GET /recipes (200)", () => {
    const expected = integrationdata.displayrecipes.map((i) => ({
      ...i,
      date: i.date.toISOString(),
    }));
    return agent
      .get(`${baseURL}/recipes`)
      .set("Accept", "application/json")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(
        "Content-Length",
        (`${JSON.stringify(expected)}`.length + 3).toString()
      )
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(expected);
      });
  });

  it("GET /recipes (500)", async () => {
    const error = "Error getting all recipes";
    await restartFunc();
    await agent
      .get(`${baseURL}/recipes`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
    await IntegrationData();
  });

  it("POST /recipes (201)", () => {
    return agent
      .post(`${baseURL}/recipes`)
      .send(integrationdata.recipes[5])
      .expect(
        "Content-Length",
        JSON.stringify({
          id: integrationdata.recipes.length + 1,
        }).length.toString()
      )
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: integrationdata.recipes.length + 1,
        });
      });
  });

  it("POST /recipes (400)", () => {
    const error = "Recipe or Ingredients not defined";
    return agent
      .post(`${baseURL}/recipes`)
      .send({ recipe: [] })
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toEqual(error);
      });
  });

  it("POST /recipes (500)", () => {
    const error = "Failed to create recipe";

    return agent
      .post(`${baseURL}/recipes`)
      .send({ ...integrationdata.recipes[5], title: null })
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("GET /recipes/:recipe_id (200)", () => {
    const expected = {
      ...integrationdata.recipes[5],
      date: integrationdata.recipes[5].date.toISOString(),
      ingredients: integrationdata.recipes[5].ingredients
        .sort((a, b) => a.ingredient.localeCompare(b.ingredient))
        .map((i) => ({ ...i, stdunits: JSON.stringify(i.stdunits) })),
    };
    return agent
      .get(`${baseURL}/recipes/${integrationdata.recipes[5].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        "Content-Length",
        (JSON.stringify(expected).length + 1).toString()
      )
      .expect(200)
      .then((response) => expect(response.body).toMatchObject(expected));
  });

  it("GET /recipes/:recipe_id (404)", () => {
    const error = "Error getting recipe";

    return agent
      .get(`${baseURL}/recipes/${-1}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(404)
      .then((response) => expect(response.text).toBe(error));
  });

  it("GET /recipes/:recipe_id (500)", () => {
    const error = "Error getting recipe";

    return agent
      .get(`${baseURL}/recipes/ABA`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("PATCH /recipes/:recipe_id (200)", () => {
    return agent
      .patch(`${baseURL}/recipes/${integrationdata.recipes[5].id}`)
      .send(integrationdata.recipes[6])
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it("PATCH /recipes/:recipe_id (500)", () => {
    const error = "Failed to update recipe";

    return agent
      .patch(`${baseURL}/recipes/${integrationdata.recipes[5].id}`)
      .send({})
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("DELETE /recipes/:recipe_id (200)", () => {
    return agent
      .delete(`${baseURL}/recipes/${integrationdata.recipes[5].id}`)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it("DELETE /recipes/:recipe_id (500)", () => {
    const error = "Failed to delete recipe";

    return agent
      .delete(`${baseURL}/recipes/${integrationdata.recipes[5].id}`)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("GET /recipes/:recipe_id/rating (200)", () => {
    return agent
      .get(`${baseURL}/recipes/${integrationdata.recipes[0].id}/rating`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "19")
      .expect(200)
      .then((response) => {
        expect(parseFloat(response.body.rating)).toBeCloseTo((3 + 2 + 2) / 3, 4);
      });
  });

  it("GET /recipes/:recipe_id/rating (404)", () => {
    const error = "ERROR 404";

    return agent
      .get(`${baseURL}/recipes/${6}/rating`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(404)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("GET /recipes/:recipe_id/rating (500)", () => {
    const error = "ERROR";
    return agent
      .get(`${baseURL}/recipes/aba/rating`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
});
