import request from "supertest";
import {
  create_rating,
  error_401,
  mocked_username,
  rating,
  recipe,
} from "../../../testdata/mocktestdata.js";
import { mockSession, mock_ratingService, mocked_app } from "../../../testdata/mocks.js";
import { ratingRouter } from "../../ratingRouter.js";
import { ratingService } from "../../../services/ratingservice.js";

mock_ratingService();

mocked_app.use("/ratings", ratingRouter);

describe("Rating Router unit test", () => {
  it("POST /ratings (201)", () => {
    return request(mocked_app)
      .post(`/ratings`)
      .send(create_rating)
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
        expect(ratingService.create).toHaveBeenCalledTimes(1);
        expect(ratingService.create).toHaveBeenCalledWith(
          create_rating.recipe_id,
          mocked_username,
          create_rating.rating
        );
      });
  });
  it.each([0, 6, -1, null])("POST /ratings (400)", (rating) => {
    const error = "ERROR 400";
    return request(mocked_app)
      .post(`/ratings`)
      .send({ ...create_rating, rating: rating })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(ratingService.create).not.toHaveBeenCalled();
      });
  });
  it("POST /ratings (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .post(`/ratings`)
      .send(create_rating)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(ratingService.create).not.toHaveBeenCalled();
      });
  });
  it("POST /ratings (500)", () => {
    const error = "Failed to create rating";
    jest.spyOn(ratingService, "create").mockRejectedValueOnce(error);
    return request(mocked_app)
      .post(`/ratings`)
      .send(create_rating)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(ratingService.create).toHaveBeenCalledTimes(1);
        expect(ratingService.create).toHaveBeenCalledWith(
          create_rating.recipe_id,
          mocked_username,
          create_rating.rating
        );
      });
  });
  it("GET /ratings/:recipe_id (200)", () => {
    return request(mocked_app)
      .get(`/ratings/${recipe.image_id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(rating).length.toString())
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toStrictEqual(rating);
        expect(ratingService.getUserRating).toHaveBeenCalledTimes(1);
        expect(ratingService.getUserRating).toHaveBeenCalledWith(
          recipe.image_id,
          mocked_username
        );
      });
  });
  it("GET /ratings/:image_id (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .get(`/ratings/${recipe.image_id}`)
      .send(create_rating)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(ratingService.create).not.toHaveBeenCalled();
      });
  });
  it("GET /ratings/:image_id (404)", () => {
    jest.spyOn(ratingService, "getUserRating").mockResolvedValueOnce([]);
    return request(mocked_app)
      .get(`/ratings/${recipe.image_id}`)
      .set("Accept", "application/json")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("");
        expect(ratingService.getUserRating).toHaveBeenCalledTimes(1);
        expect(ratingService.getUserRating).toHaveBeenCalledWith(
          recipe.image_id,
          mocked_username
        );
      });
  });
  it("GET /ratings/:image_id (500)", () => {
    const error = "Failed to get rating";
    jest.spyOn(ratingService, "getUserRating").mockRejectedValueOnce(error);
    return request(mocked_app)
      .get(`/ratings/${recipe.image_id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(ratingService.getUserRating).toHaveBeenCalledTimes(1);
        expect(ratingService.getUserRating).toHaveBeenCalledWith(
          recipe.image_id,
          mocked_username
        );
      });
  });
  it("PATCH /ratings/:image_id (200)", () => {
    return request(mocked_app)
      .patch(`/ratings/${recipe.image_id}`)
      .send(rating)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(ratingService.update).toHaveBeenCalledTimes(1);
        expect(ratingService.update).toHaveBeenCalledWith(
          recipe.image_id,
          mocked_username,
          rating.rating
        );
      });
  });

  it.each([0, 6, -1, null])("PATCH /ratings/:image_id (400)", (rating) => {
    const error = "ERROR 400";
    return request(mocked_app)
      .patch(`/ratings/${recipe.image_id}`)
      .send({ rating: rating })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(ratingService.update).not.toHaveBeenCalled();
      });
  });
  it("PATCH /ratings (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .patch(`/ratings/${recipe.image_id}`)
      .send(rating)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(ratingService.update).not.toHaveBeenCalled();
      });
  });
  it("PATCH /ratings (500)", () => {
    const error = "Failed to update rating";
    jest.spyOn(ratingService, "update").mockRejectedValueOnce(error);
    return request(mocked_app)
      .patch(`/ratings/${recipe.image_id}`)
      .send(rating)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(ratingService.update).toHaveBeenCalledTimes(1);
        expect(ratingService.update).toHaveBeenCalledWith(
          recipe.image_id,
          mocked_username,
          rating.rating
        );
      });
  });
  it("DELETE /ratings/:recipe_id (200)", () => {
    return request(mocked_app)
      .delete(`/ratings/${recipe.id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(ratingService.delete).toHaveBeenCalledTimes(1);
        expect(ratingService.delete).toHaveBeenCalledWith(
          recipe.id,
          mocked_username
        );
      });
  });
  it("DELETE /ratings/:image_id (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .delete(`/ratings/${recipe.image_id}`)
      .send(create_rating)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(ratingService.delete).not.toHaveBeenCalled();
      });
  });
  it("DELETE /ratings/:image_id (500)", () => {
    const error = "Failed to remove rating";
    jest.spyOn(ratingService, "delete").mockRejectedValueOnce(error);
    return request(mocked_app)
      .delete(`/ratings/${recipe.image_id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(ratingService.delete).toHaveBeenCalledTimes(1);
        expect(ratingService.delete).toHaveBeenCalledWith(
          recipe.image_id,
          mocked_username
        );
      });
  });
});
