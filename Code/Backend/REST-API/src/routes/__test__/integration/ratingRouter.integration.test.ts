import {
  IntegrationData,
  integrationdata,
} from "../../../testdata/integrationtestdata.js";
import request from "supertest";
import pool from "../../../mysql-pool.js";
import { app } from "../../../app.js";
import { error_401, rating } from "../../../testdata/mocktestdata.js";

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

describe("Rating Router integration test", () => {
  it("POST /ratings (201)", () => {
    return agent
      .post(`${baseURL}/ratings`)
      .send(integrationdata.ratings[1][0])
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it.each([0, 6, -1, null])("POST /ratings (400)", (rating) => {
    const error = "ERROR 400";
    return agent
      .post(`${baseURL}/ratings`)
      .send({ ...integrationdata.ratings[1][0], rating: rating })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("POST /ratings (401)", () => {
    return request(app)
      .post(`${baseURL}/ratings`)
      .send(integrationdata.ratings[1][0])
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("POST /ratings (500)", () => {
    const error = "Failed to create rating";
    return agent
      .post(`${baseURL}/ratings`)
      .send(integrationdata.ratings[1][0])
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("GET /ratings/:recipe_id (200)", () => {
    const userRating = { rating: integrationdata.ratings[0][0].rating };
    return agent
      .get(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(userRating).length.toString())
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toMatchObject(userRating);
      });
  });
  it("GET /ratings/:image_id (401)", () => {
    return request(app)
      .get(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("GET /ratings/:image_id (404)", () => {
    return agent
      .get(`${baseURL}/ratings/${integrationdata.recipes[5].id}`)
      .set("Accept", "application/json")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("GET /ratings/:image_id (500)", () => {
    const error = "Failed to get rating";
    return agent
      .get(`${baseURL}/ratings/ababa`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("PATCH /ratings/:image_id (200)", () => {
    return agent
      .patch(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .send({ rating: 2 })
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });

  it.each([0, 6, -1, null])("PATCH /ratings/:image_id (400)", (rating) => {
    const error = "ERROR 400";
    return agent
      .patch(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .send({ rating: rating })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("PATCH /ratings (401)", () => {
    return request(app)
      .patch(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .send(rating)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("PATCH /ratings (500)", () => {
    const error = "Failed to update rating";
    return agent
      .patch(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .send({ rating: "HAH" })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("DELETE /ratings/:recipe_id (200)", () => {
    return agent
      .delete(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("DELETE /ratings/:image_id (401)", () => {
    return request(app)
      .delete(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("DELETE /ratings/:image_id (500)", () => {
    const error = "Failed to remove rating";
    return agent
      .delete(`${baseURL}/ratings/${integrationdata.recipes[0].id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
});
