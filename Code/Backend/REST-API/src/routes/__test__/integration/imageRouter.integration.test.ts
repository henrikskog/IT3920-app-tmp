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
    .post(`/api/v1/logins`)
    .send({
      username: integrationdata.users[0].name,
      password: integrationdata.users[0].password,
    })
    .set("Accept", "application/json");
});

afterAll(() => pool.end());

describe("Image Router integration test", () => {
  it("POST /images (201)", () => {
    return agent
      .post(`${baseURL}/images`)
      .attach("image", integrationdata.images[0].image, {
        filename: "TestImage",
        contentType: integrationdata.images[0].type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: integrationdata.images.length + 1,
        });
      });
  });
  it("POST /images (401)", () => {
    return request(app)
      .post(`${baseURL}/images`)
      .attach("image", integrationdata.images[0].image, {
        filename: "TestImage",
        contentType: integrationdata.images[0].type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("POST /images (500)", async () => {
    const error = "A server error!";
    await restartFunc();
    await agent
      .post(`${baseURL}/images`)
      .attach("image", integrationdata.images[0].image, {
        filename: "TestImage",
        contentType: integrationdata.images[0].type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
    await IntegrationData();
  });
  it("GET /images/:image_id (200)", () => {
    const image_id = 1;
    return agent
      .get(`${baseURL}/images/${image_id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", integrationdata.images[image_id - 1].type)
      .expect(
        "Content-Length",
        integrationdata.images[image_id - 1].image.length.toString()
      )
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject(
          integrationdata.images[image_id - 1].image
        );
      });
  });
  it("GET /images/:image_id (404)", () => {
    const image_id = -1;
    return agent
      .get(`${baseURL}/images/${image_id}`)
      .set("Accept", "application/json")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("GET /images/:image_id (500)", () => {
    const error = "There is a server error!";
    const image_id = null;
    return agent
      .get(`${baseURL}/images/${image_id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
  it("PATCH /images/:image_id (200)", () => {
    const image_id = 1;
    const replace_id = 3;
    return agent
      .patch(`${baseURL}/images/${image_id}`)
      .attach("image", integrationdata.images[replace_id].image, {
        filename: "TestImage",
        contentType: integrationdata.images[replace_id].type,
      })
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
      });
  });
  it("PATCH /images (401)", () => {
    const image_id = 1;
    const replace_id = 3;
    return request(app)
      .patch(`${baseURL}/images/${image_id}`)
      .attach("image", integrationdata.images[replace_id].image, {
        filename: "TestImage",
        contentType: integrationdata.images[replace_id].type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
      });
  });
  it("PATCH /images (500)", () => {
    const error = "A server error!";
    const image_id = null;
    const replace_id = 3;
    return agent
      .patch(`${baseURL}/images/${image_id}`)
      .attach("image", integrationdata.images[replace_id].image, {
        filename: "TestImage",
        contentType: integrationdata.images[replace_id].type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
});
