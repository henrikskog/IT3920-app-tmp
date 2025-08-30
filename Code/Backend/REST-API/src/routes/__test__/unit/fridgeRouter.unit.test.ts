import request from "supertest";
import { fridgeService } from "../../../services/fridgeservice.js";
import { fridgeRouter } from "../../fridgeRouter.js";
import { mocked_username, simple_ingredients, unit_ingredients } from "../../../testdata/mocktestdata.js";
import { mock_fridgeService, mocked_app } from "../../../testdata/mocks.js";

mock_fridgeService();

mocked_app.use("/fridges", fridgeRouter);

describe("Fridge Router unit test", () => {
  it("GET /fridges/:username (200)", () => {
    return request(mocked_app)
      .get(`/fridges/${mocked_username}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        "Content-Length",
        JSON.stringify(unit_ingredients).length.toString()
      )
      .expect(200)
      .then((response) =>
        expect(response.body).toStrictEqual(unit_ingredients)
      );
  });
  it("GET /fridges/:username (500)", () => {
    const error = "Error getting fridge ingredients";
    jest.spyOn(fridgeService, "get").mockRejectedValueOnce("db dead");

    return request(mocked_app)
      .get(`/fridges/${mocked_username}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
      });
  });

  it("POST /fridges/:username (200)", () => {
    return request(mocked_app)
      .post(`/fridges/${mocked_username}`)
      .send(simple_ingredients)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(fridgeService.create).toHaveBeenCalledTimes(3);
        expect(fridgeService.create).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[0]
        );
        expect(fridgeService.create).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[1]
        );
        expect(fridgeService.create).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[2]
        );
      });
  });

  it("POST /fridges/:username (500)", () => {
    const error = "Failed to add ingredient to fridge";

    jest.spyOn(fridgeService, "create").mockRejectedValueOnce("db dead");

    return request(mocked_app)
      .post(`/fridges/${mocked_username}`)
      .send(simple_ingredients)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(fridgeService.create).toHaveBeenCalledTimes(3);
        expect(fridgeService.create).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[0]
        );
        expect(fridgeService.create).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[1]
        );
        expect(fridgeService.create).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[2]
        );
      });
  });

  it("PATCH /fridges/:username (200)", () => {
    return request(mocked_app)
      .patch(`/fridges/${mocked_username}`)
      .send(simple_ingredients)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(fridgeService.update).toHaveBeenCalledTimes(3);
        expect(fridgeService.update).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[0]
        );
        expect(fridgeService.update).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[1]
        );
        expect(fridgeService.update).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[2]
        );
      });
  });

  it("PATCH /fridges/:username (500)", () => {
    const error = "Failed to update fridge ingredient";

    jest.spyOn(fridgeService, "update").mockRejectedValueOnce("db dead");

    return request(mocked_app)
      .patch(`/fridges/${mocked_username}`)
      .send(simple_ingredients)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(fridgeService.update).toHaveBeenCalledTimes(3);
        expect(fridgeService.update).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[0]
        );
        expect(fridgeService.update).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[1]
        );
        expect(fridgeService.update).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[2]
        );
      });
  });

  it("DELETE /fridges/:username (200)", () => {
    return request(mocked_app)
      .delete(
        `/fridges/${mocked_username}/ingredients/${simple_ingredients[0].ingredient}`
      )
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(fridgeService.delete).toHaveBeenCalledTimes(1);
        expect(fridgeService.delete).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[0].ingredient
        );
      });
  });

  it("DELETE /fridges/:username/ingredients/:ingredient (500)", () => {
    const error = "Failed to delete fridge ingredient";

    jest.spyOn(fridgeService, "delete").mockRejectedValueOnce("db dead");

    return request(mocked_app)
      .delete(
        `/fridges/${mocked_username}/ingredients/${simple_ingredients[0].ingredient}`
      )
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(fridgeService.delete).toHaveBeenCalledTimes(1);
        expect(fridgeService.delete).toHaveBeenCalledWith(
          mocked_username,
          simple_ingredients[0].ingredient
        );
      });
  });
});
