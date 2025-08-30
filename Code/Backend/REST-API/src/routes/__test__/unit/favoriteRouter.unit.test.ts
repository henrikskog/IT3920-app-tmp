import request from "supertest";
import { favoriteService } from "../../../services/favoriteservice.js";
import {
  error_401,
  favorite,
  mocked_username,
  recipe,
} from "../../../testdata/mocktestdata.js";
import {
  mockSession,
  mock_favoriteService,
  mocked_app,
} from "../../../testdata/mocks.js";
import { favoriteRouter } from "../../favoriteRouter.js";
import { DisplayRecipe } from "../../../types.js";

mock_favoriteService();

mocked_app.use("/favorites", favoriteRouter);

describe("Favorite Router unit test", () => {
  it("GET /favorites (200)", () => {
    return request(mocked_app)
      .get(`/favorites`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify([recipe]).length.toString())
      .expect(200)
      .then((response: { body: DisplayRecipe[] }) => {
        expect([
          {
            ...response.body[0],
            date: new Date(response.body[0].date),
          },
        ]).toStrictEqual([recipe]);
        expect(favoriteService.getAll).toHaveBeenCalledTimes(1);
        expect(favoriteService.getAll).toHaveBeenCalledWith(mocked_username);
      });
  });
  it("GET /favorites (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .get(`/favorites`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(favoriteService.getAll).not.toHaveBeenCalled();
      });
  });
  it("GET /favorites (500)", () => {
    const error = "Error getting all favorites";
    jest.spyOn(favoriteService, "getAll").mockRejectedValueOnce(error);
    return request(mocked_app)
      .get(`/favorites`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(favoriteService.getAll).toHaveBeenCalledTimes(1);
        expect(favoriteService.getAll).toHaveBeenCalledWith(mocked_username);
      });
  });
  it("POST /favorites (201)", () => {
    return request(mocked_app)
      .post(`/favorites`)
      .send({ recipe_id: recipe.id })
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
        expect(favoriteService.create).toHaveBeenCalledTimes(1);
        expect(favoriteService.create).toHaveBeenCalledWith(
          mocked_username,
          recipe.id
        );
      });
  });
  it("POST /favorites (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .post(`/favorites`)
      .send({ recipe_id: recipe.id })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(favoriteService.create).not.toHaveBeenCalled();
      });
  });
  it("POST /favorites (500)", () => {
    const error = "Failed to create favorite";
    jest.spyOn(favoriteService, "create").mockRejectedValueOnce(error);
    return request(mocked_app)
      .post(`/favorites`)
      .send({ recipe_id: recipe.id })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(favoriteService.create).toHaveBeenCalledTimes(1);
        expect(favoriteService.create).toHaveBeenCalledWith(
          mocked_username,
          recipe.id
        );
      });
  });
  it("DELETE /favorites/recipes/:recipe_id (200)", () => {
    return request(mocked_app)
      .delete(`/favorites/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(favoriteService.delete).toHaveBeenCalledTimes(1);
        expect(favoriteService.delete).toHaveBeenCalledWith(
          mocked_username,
          recipe.id
        );
      });
  });
  it("DELETE /favorites/recipes/:recipe_id (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .delete(`/favorites/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(favoriteService.delete).not.toHaveBeenCalled();
      });
  });
  it("DELETE /favorites/recipes/:recipe_id (500)", () => {
    const error = "Failed to delete favorite";
    jest.spyOn(favoriteService, "delete").mockRejectedValueOnce(error);
    return request(mocked_app)
      .delete(`/favorites/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(favoriteService.delete).toHaveBeenCalledTimes(1);
        expect(favoriteService.delete).toHaveBeenCalledWith(
          mocked_username,
          recipe.id
        );
      });
  });
  it("GET /favorites/recipes/:recipe_id (200)", () => {
    return request(mocked_app)
      .get(`/favorites/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify([favorite]).length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual([favorite]);
        expect(favoriteService.get).toHaveBeenCalledTimes(1);
        expect(favoriteService.get).toHaveBeenCalledWith(
          mocked_username,
          recipe.id
        );
      });
  });
  it("GET /favorites/recipes/:recipe_id (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .get(`/favorites/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(favoriteService.get).not.toHaveBeenCalled();
      });
  });
  it("GET /favorites/recipes/:recipe_id (404)", () => {
    jest.spyOn(favoriteService, "get").mockResolvedValueOnce([]);

    return request(mocked_app)
      .get(`/favorites/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect(404)
      .then((response) => {
        expect(response.text).toStrictEqual("");
        expect(favoriteService.get).toHaveBeenCalledTimes(1);
        expect(favoriteService.get).toHaveBeenCalledWith(
          mocked_username,
          recipe.id
        );
      });
  });
  it("GET /favorites/recipes/:recipe_id (500)", () => {
    const error = "Failed to get favorite";
    jest.spyOn(favoriteService, "get").mockRejectedValueOnce(error);
    return request(mocked_app)
      .get(`/favorites/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(favoriteService.get).toHaveBeenCalledTimes(1);
        expect(favoriteService.get).toHaveBeenCalledWith(
          mocked_username,
          recipe.id
        );
      });
  });
});
