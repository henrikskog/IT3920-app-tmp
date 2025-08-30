import request from "supertest";
import { recipeRouter } from "../../recipeRouter.js";
import { recipeService } from "../../../services/recipeservice.js";
import { mock_recipeService, mocked_app } from "../../../testdata/mocks.js";
import {
  create_recipe,
  update_recipe,
  full_recipe,
  recipe,
  rating,
  mocked_username,
} from "../../../testdata/mocktestdata.js";

// Mock of recipe Service
mock_recipeService();

mocked_app.use("/recipes", recipeRouter);

describe("Recipe Router unit test", () => {
  it("GET /recipes (200)", () => {
    const expected = [JSON.parse(JSON.stringify(recipe))];
    return request(mocked_app)
      .get(`/recipes`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(expected).length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(expected);
      });
  });

  it("GET /recipes (500)", () => {
    const error = "Error getting all recipes";
    jest.spyOn(recipeService, "getAll").mockRejectedValue("db dead");

    return request(mocked_app)
      .get(`/recipes`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("POST /recipes (201)", () => {
    return request(mocked_app)
      .post(`/recipes`)
      .send(create_recipe)
      .expect("Content-Length", JSON.stringify({ id: 1 }).length.toString())
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({ id: 1 });
        expect(recipeService.create).toHaveBeenCalledTimes(1);
        expect(recipeService.create).toHaveBeenCalledWith(
          mocked_username,
          create_recipe
        );
      });
  });

  it("POST /recipes (400)", () => {
    const error = "Recipe or Ingredients not defined";
    return request(mocked_app)
      .post(`/recipes`)
      .send({ recipe: [] })
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toEqual(error);
        expect(recipeService.create).not.toHaveBeenCalled();
      });
  });

  it("POST /recipes (500)", () => {
    const error = "Failed to create recipe";

    jest.spyOn(recipeService, "create").mockRejectedValue("db dead");

    return request(mocked_app)
      .post(`/recipes`)
      .send(create_recipe)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(recipeService.create).toHaveBeenCalledTimes(1);
        expect(recipeService.create).toHaveBeenCalledWith(
          mocked_username,
          create_recipe
        );
      });
  });

  it("GET /recipes/:recipe_id (200)", () => {
    const expected = JSON.parse(JSON.stringify(full_recipe));
    return request(mocked_app)
      .get(`/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(expected).length.toString())
      .expect(200)
      .then((response) => expect(response.body).toStrictEqual(expected));
  });

  it("GET /recipes/:recipe_id (404)", () => {
    const error = "Error getting recipe";
    jest.spyOn(recipeService, "get").mockResolvedValue([]);

    return request(mocked_app)
      .get(`/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(404)
      .then((response) => expect(response.text).toBe(error));
  });

  it("GET /recipes/:recipe_id (500)", () => {
    const error = "Error getting recipe";
    jest.spyOn(recipeService, "get").mockRejectedValue("db dead");

    return request(mocked_app)
      .get(`/recipes/${recipe.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("PATCH /recipes/:recipe_id (200)", () => {
    return request(mocked_app)
      .patch(`/recipes/${recipe.id}`)
      .send(update_recipe)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(recipeService.update).toHaveBeenCalledTimes(1);
        expect(recipeService.update).toHaveBeenCalledWith(
          mocked_username,
          recipe.id,
          update_recipe
        );
      });
  });

  it("PATCH /recipes/:recipe_id (500)", () => {
    const error = "Failed to update recipe";

    jest.spyOn(recipeService, "update").mockRejectedValue("db dead");

    return request(mocked_app)
      .patch(`/recipes/${recipe.id}`)
      .send(update_recipe)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(recipeService.update).toHaveBeenCalledTimes(1);
        expect(recipeService.update).toHaveBeenCalledWith(
          mocked_username,
          recipe.id,
          update_recipe
        );
      });
  });

  it("DELETE /recipes/:recipe_id (200)", () => {
    return request(mocked_app)
      .delete(`/recipes/${recipe.id}`)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(recipeService.delete).toHaveBeenCalledTimes(1);
        expect(recipeService.delete).toHaveBeenCalledWith(recipe.id);
      });
  });

  it("DELETE /recipes/:recipe_id (500)", () => {
    const error = "Failed to delete recipe";

    jest.spyOn(recipeService, "delete").mockRejectedValue("db dead");

    return request(mocked_app)
      .delete(`/recipes/${recipe.id}`)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(recipeService.delete).toHaveBeenCalledTimes(1);
        expect(recipeService.delete).toHaveBeenCalledWith(recipe.id);
      });
  });

  it("GET /recipes/:recipe_id/rating (200)", () => {
    return request(mocked_app)
      .get(`/recipes/${recipe.id}/rating`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(rating).length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(rating);
        expect(recipeService.getRating).toHaveBeenCalledTimes(1);
        expect(recipeService.getRating).toHaveBeenCalledWith(recipe.id);
      });
  });

  it("GET /recipes/:recipe_id/rating (404)", () => {
    const error = "ERROR 404";
    jest.spyOn(recipeService, "getRating").mockResolvedValue([]);

    return request(mocked_app)
      .get(`/recipes/${recipe.id}/rating`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(404)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(recipeService.getRating).toHaveBeenCalledTimes(1);
        expect(recipeService.getRating).toHaveBeenCalledWith(recipe.id);
      });
  });

  it("GET /recipes/:recipe_id/rating (500)", () => {
    const error = "ERROR";
    jest.spyOn(recipeService, "getRating").mockRejectedValue("db dead");

    return request(mocked_app)
      .get(`/recipes/${recipe.id}/rating`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(recipeService.getRating).toHaveBeenCalledTimes(1);
        expect(recipeService.getRating).toHaveBeenCalledWith(recipe.id);
      });
  });
});
