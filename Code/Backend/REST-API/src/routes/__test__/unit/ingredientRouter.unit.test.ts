import request from "supertest";
import { ingredientRouter } from "../../ingredientRouter.js";
import { ingredientService } from "../../../services/ingredientservice.js";
import { unit_ingredients } from "../../../testdata/mocktestdata.js";
import { mock_ingredientService, mocked_app } from "../../../testdata/mocks.js";

mock_ingredientService();

mocked_app.use("/ingredients", ingredientRouter);

describe("Ingredient Router unit test", () => {
  it("GET /ingredients (200)", () => {
    const expected = JSON.parse(JSON.stringify(unit_ingredients));
    return request(mocked_app)
      .get(`/ingredients`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(expected).length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(expected);
      });
  });

  it("GET /ingredients (500)", () => {
    const error = "Error getting all ingredients";
    jest.spyOn(ingredientService, "getAll").mockRejectedValue("db dead");

    return request(mocked_app)
      .get(`/ingredients`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("POST /ingredients (200)", () => {
    return request(mocked_app)
      .post(`/ingredients`)
      .send(unit_ingredients[0])
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(ingredientService.create).toHaveBeenCalledTimes(1);
        expect(ingredientService.create).toHaveBeenCalledWith(
          JSON.parse(JSON.stringify(unit_ingredients[0]))
        );
      });
  });

  it("POST /ingredients (500)", () => {
    const error = "Failed to create ingredient";

    jest.spyOn(ingredientService, "create").mockRejectedValue("db dead");

    return request(mocked_app)
      .post(`/ingredients`)
      .send(unit_ingredients[0])
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(ingredientService.create).toHaveBeenCalledTimes(1);
        expect(ingredientService.create).toHaveBeenCalledWith(
          JSON.parse(JSON.stringify(unit_ingredients[0]))
        );
      });
  });

  it("GET /ingredients/:ingredient (200)", () => {
    const expected = JSON.parse(JSON.stringify(unit_ingredients[0]));
    return request(mocked_app)
      .get(`/ingredients/${unit_ingredients[0].ingredient}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(expected).length.toString())
      .expect(200)
      .then((response) => expect(response.body).toStrictEqual(expected));
  });

  it("GET /ingredients/:ingredient (404)", () => {
    const error = "Error getting ingredient";
    jest.spyOn(ingredientService, "get").mockResolvedValue([]);

    return request(mocked_app)
      .get(`/ingredients/${unit_ingredients[0].ingredient}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(404)
      .then((response) => expect(response.text).toBe(error));
  });

  it("GET /ingredients/:ingredient (500)", () => {
    const error = "Error getting all ingredients";
    jest.spyOn(ingredientService, "get").mockRejectedValue("db dead");

    return request(mocked_app)
      .get(`/ingredients/${unit_ingredients[0].ingredient}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });
});
