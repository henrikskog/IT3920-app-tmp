import request from "supertest";
import { recipeService } from "../../../services/recipeservice.js";
import {
  mockSession,
  mock_recipeService,
  mock_shoppinglistService,
  mocked_app,
} from "../../../testdata/mocks.js";
import {
  recipe,
  simple_ingredients,
  shopping_list_base,
  create_shopping_list,
  error_401,
  shopping_list_item,
  mocked_username,
} from "../../../testdata/mocktestdata.js";
import { shoppinglistService } from "../../../services/shoppinglistservice.js";
import { shoppingListRouter } from "../../shoppinglistRouter.js";

mock_shoppinglistService();
mock_recipeService();

mocked_app.use("/shoppinglists", shoppingListRouter);

describe("ShoppingList Router unit test", () => {
  it("GET /shoppinglists (200)", () => {
    jest
      .spyOn(shoppinglistService, "getRecipes")
      .mockResolvedValueOnce([
        shopping_list_base,
        shopping_list_base,
        shopping_list_base,
      ]);

    jest
      .spyOn(shoppinglistService, "getIngredients")
      .mockResolvedValueOnce(simple_ingredients)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(simple_ingredients);

    jest
      .spyOn(recipeService, "get")
      .mockResolvedValueOnce([recipe])
      .mockResolvedValueOnce([recipe])
      .mockResolvedValueOnce([]);

    const expected = JSON.stringify([shopping_list_item]);
    return request(mocked_app)
      .get(`/shoppinglists`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", expected.length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(JSON.parse(expected));
        expect(shoppinglistService.getRecipes).toHaveBeenCalledTimes(1);
        expect(shoppinglistService.getRecipes).toHaveBeenCalledWith(
          mocked_username
        );
        expect(recipeService.get).toHaveBeenCalledTimes(3);
        expect(recipeService.get).toHaveBeenCalledWith(
          shopping_list_base.recipe_id
        );
        expect(shoppinglistService.getIngredients).toHaveBeenCalledTimes(3);
        expect(shoppinglistService.getIngredients).toHaveBeenCalledWith(
          shopping_list_base.id
        );
      });
  });
  it("GET /shoppinglists (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .get(`/shoppinglists`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(shoppinglistService.getRecipes).not.toHaveBeenCalled();
        expect(shoppinglistService.getIngredients).not.toHaveBeenCalled();
        expect(recipeService.get).not.toHaveBeenCalled();
      });
  });
  it("GET /shoppinglists (500)", () => {
    const error = "Failed to get shopping list data";
    jest.spyOn(shoppinglistService, "getRecipes").mockRejectedValueOnce(error);

    return request(mocked_app)
      .get(`/shoppinglists`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(shoppinglistService.getRecipes).toHaveBeenCalledTimes(1);
        expect(shoppinglistService.getRecipes).toHaveBeenCalledWith(
          mocked_username
        );
        expect(shoppinglistService.getIngredients).not.toHaveBeenCalled();
        expect(recipeService.get).not.toHaveBeenCalled();
      });
  });
  it("POST /shoppinglists (201)", () => {
    return request(mocked_app)
      .post(`/shoppinglists`)
      .send(create_shopping_list)
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
        expect(shoppinglistService.create).toHaveBeenCalledTimes(1);
        expect(shoppinglistService.create).toHaveBeenCalledWith(
          mocked_username,
          create_shopping_list.recipe_id
        );
      });
  });
  it("POST /shoppinglists (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .post(`/shoppinglists`)
      .send(create_shopping_list)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(shoppinglistService.create).not.toHaveBeenCalled();
      });
  });
  it("POST /shoppinglists (500)", () => {
    const error = "Failed to create shoppinglist";
    jest.spyOn(shoppinglistService, "create").mockRejectedValueOnce(error);

    return request(mocked_app)
      .post(`/shoppinglists`)
      .send(create_shopping_list)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(shoppinglistService.create).toHaveBeenCalledTimes(1);
        expect(shoppinglistService.create).toHaveBeenCalledWith(
          mocked_username,
          create_shopping_list.recipe_id
        );
      });
  });
  it("DELETE /shoppinglists/:shopping_list_id (200)", () => {
    return request(mocked_app)
      .delete(`/shoppinglists/${shopping_list_base.id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(shoppinglistService.delete).toHaveBeenCalledTimes(1);
        expect(shoppinglistService.delete).toHaveBeenCalledWith(
          mocked_username,
          shopping_list_base.id
        );
      });
  });
  it("DELETE /shoppinglists/:shopping_list_id (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .delete(`/shoppinglists/${shopping_list_base.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(shoppinglistService.delete).not.toHaveBeenCalled();
      });
  });
  it("DELETE /shoppinglists/:shopping_list_id (500)", () => {
    const error = "Failed to delete shoppinglist";
    jest.spyOn(shoppinglistService, "delete").mockRejectedValueOnce(error);

    return request(mocked_app)
      .delete(`/shoppinglists/${shopping_list_base.id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(shoppinglistService.delete).toHaveBeenCalledTimes(1);
        expect(shoppinglistService.delete).toHaveBeenCalledWith(
          mocked_username,
          shopping_list_base.id
        );
      });
  });
});
