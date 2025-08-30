import request from "supertest";
import { imageService } from "../../../services/imageservice.js";
import { error_401, image, recipe } from "../../../testdata/mocktestdata.js";
import { mockSession, mock_imageService, mocked_app } from "../../../testdata/mocks.js";
import { imageRouter } from "../../imageRouter.js";

mock_imageService();

mocked_app.use("/images", imageRouter);

describe("Image Router unit test", () => {
  it("POST /images (201)", () => {
    return request(mocked_app)
      .post(`/images`)
      .attach("image", image.image, {
        filename: "HAHA",
        contentType: image.type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toStrictEqual({ id: recipe.image_id });
        expect(imageService.create).toHaveBeenCalledTimes(1);
        expect(imageService.create).toHaveBeenCalledWith(image);
      });
  });
  it("POST /images (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .post(`/images`)
      .attach("image", image.image, {
        filename: "HAHA",
        contentType: image.type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(imageService.create).not.toHaveBeenCalled();
      });
  });
  it("POST /images (500)", () => {
    const error = "A server error!";
    jest.spyOn(imageService, "create").mockRejectedValueOnce(error);
    return request(mocked_app)
      .post(`/images`)
      .attach("image", image.image, {
        filename: "HAHA",
        contentType: image.type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(imageService.create).toHaveBeenCalledTimes(1);
        expect(imageService.create).toHaveBeenCalledWith(image);
      });
  });
  it("GET /images/:image_id (200)", () => {
    return request(mocked_app)
      .get(`/images/${recipe.image_id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", image.type)
      .expect("Content-Length", image.image.length.toString())
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toStrictEqual(image.image);
        expect(imageService.get).toHaveBeenCalledTimes(1);
        expect(imageService.get).toHaveBeenCalledWith(recipe.image_id);
      });
  });
  it("GET /images/:image_id (404)", () => {
    jest.spyOn(imageService, "get").mockResolvedValueOnce([]);
    return request(mocked_app)
      .get(`/images/${recipe.image_id}`)
      .set("Accept", "application/json")
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("");
        expect(imageService.get).toHaveBeenCalledTimes(1);
        expect(imageService.get).toHaveBeenCalledWith(recipe.image_id);
      });
  });
  it("GET /images/:image_id (500)", () => {
    const error = "There is a server error!";
    jest.spyOn(imageService, "get").mockRejectedValueOnce(error);
    return request(mocked_app)
      .get(`/images/${recipe.image_id}`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(imageService.get).toHaveBeenCalledTimes(1);
        expect(imageService.get).toHaveBeenCalledWith(recipe.image_id);
      });
  });
  it("PATCH /images/:image_id (200)", () => {
    return request(mocked_app)
      .patch(`/images/${recipe.image_id}`)
      .attach("image", image.image, {
        filename: "HAHA",
        contentType: image.type,
      })
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("");
        expect(imageService.update).toHaveBeenCalledTimes(1);
        expect(imageService.update).toHaveBeenCalledWith(
          recipe.image_id,
          image
        );
      });
  });
  it("PATCH /images (401)", () => {
    mockSession.mockImplementationOnce((req, next) => {
      next();
    });
    return request(mocked_app)
      .patch(`/images/${recipe.image_id}`)
      .attach("image", image.image, {
        filename: "HAHA",
        contentType: image.type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error_401.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error_401);
        expect(imageService.update).not.toHaveBeenCalled();
      });
  });
  it("PATCH /images (500)", () => {
    const error = "A server error!";
    jest.spyOn(imageService, "update").mockRejectedValueOnce(error);
    return request(mocked_app)
      .patch(`/images/${recipe.image_id}`)
      .attach("image", image.image, {
        filename: "HAHA",
        contentType: image.type,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(imageService.update).toHaveBeenCalledTimes(1);
        expect(imageService.update).toHaveBeenCalledWith(
          recipe.image_id,
          image
        );
      });
  });
});
