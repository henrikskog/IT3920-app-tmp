import request from "supertest";
import express from "express";
import { userRouter } from "../../userRouter.js";
import {
  mock_loginService,
  mock_userService,
  mocked_app,
} from "../../../testdata/mocks.js";
import { create_user } from "../../../testdata/mocktestdata.js";
import { userService } from "../../../services/userservice.js";

mock_userService();
mock_loginService();

mocked_app.use("/users", userRouter);

mocked_app.use(
  (
    err: Error | string,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).send("LOGIN ERROR");
    console.log(next);
  }
);

describe("User Router unit test", () => {
  it("POST /users (201)", () => {
    return request(mocked_app)
      .post(`/users`)
      .send(create_user)
      .set("Accept", "application/json")
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("");
        expect(userService.create).toHaveBeenCalledTimes(1);
        expect(userService.create).toHaveBeenCalledWith(create_user);
      });
  });

  it.each([
    { image_id: 1, username: "Some name" },
    { image_id: 1, password: "Some password" },
    { username: "Some name", password: "Some password" },
  ])("POST /users (400)", (baddata) => {
    const error = "image, name or password was not sent";

    return request(mocked_app)
      .post(`/users`)
      .send(baddata)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
        expect(userService.create).not.toHaveBeenCalled();
      });
  });

  it("POST /users (500)", () => {
    const error = "Failed to create user";
    jest.spyOn(userService, "create").mockRejectedValueOnce(error);
    return request(mocked_app)
      .post(`/users`)
      .send(create_user)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
        expect(userService.create).toHaveBeenCalledTimes(1);
        expect(userService.create).toHaveBeenCalledWith(create_user);
      });
  });
});
