import request from "supertest";
import express from "express";
import {
  mockSession,
  mock_loginService,
  mock_userService,
  mocked_app,
} from "../../../testdata/mocks.js";
import { loginService } from "../../../services/loginservice.js";
import {
  mocked_login,
  mocked_username,
  respone_user,
} from "../../../testdata/mocktestdata.js";
import { loginRouter } from "../../loginRouter.js";

mock_userService();
mock_loginService();

mocked_app.use("/logins", loginRouter);

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

describe("Login Router unit test", () => {
  it("GET /logins (200)", () => {
    return request(mocked_app)
      .get(`/logins`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(respone_user).length.toString())
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(respone_user);
      });
  });

  it("POST /logins (201)", () => {
    return request(mocked_app)
      .post(`/logins`)
      .send(mocked_login)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect("Content-Length", JSON.stringify(respone_user).length.toString())
      .expect(201)
      .then((response) => {
        expect(response.body).toStrictEqual(respone_user);
        expect(loginService.auth).toHaveBeenCalledTimes(1);
        expect(loginService.auth).toHaveBeenCalledWith(
          mocked_login.username,
          mocked_login.password
        );
      });
  });

  it.each([
    { username: "", password: "" },
    { username: "User", password: "" },
  ])("POST /logins (400)", (baddata) => {
    const error = "Write a username and a password!";

    return request(mocked_app)
      .post(`/logins`)
      .send(baddata)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(400)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
        expect(loginService.auth).not.toHaveBeenCalled();
      });
  });

  it("POST /logins (401)", () => {
    const error = "Login unsuccessful";
    jest.spyOn(loginService, "auth").mockResolvedValueOnce(false);
    const wrongLogin = { username: "cisco", password: "cisco" };
    return request(mocked_app)
      .post(`/logins`)
      .send(wrongLogin)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(401)
      .then((response) => {
        expect(response.text).toBe(error);
        expect(loginService.auth).toHaveBeenCalledTimes(1);
        expect(loginService.auth).toHaveBeenCalledWith(
          wrongLogin.username,
          wrongLogin.password
        );
      });
  });

  it("POST /logins (500)", () => {
    const error = "LOGIN ERROR";
    jest.spyOn(loginService, "auth").mockRejectedValueOnce(error);
    return request(mocked_app)
      .post(`/logins`)
      .send(mocked_login)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
        expect(loginService.auth).toHaveBeenCalledTimes(1);
        expect(loginService.auth).toHaveBeenCalledWith(
          mocked_login.username,
          mocked_login.password
        );
      });
  });

  it("POST /logins (500) (Session regenerate)", () => {
    const error = "LOGIN ERROR";
    mockSession.mockImplementationOnce((req, next) => {
      jest.spyOn(req.session, "regenerate").mockImplementationOnce((err) => {
        err(new Error("Help"));

        return req.session;
      });
      next();
    });
    return request(mocked_app)
      .post(`/logins`)
      .send(mocked_login)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
        expect(loginService.auth).not.toHaveBeenCalled();
      });
  });

  it("DELETE /logins (200)", () => {
    return request(mocked_app)
      .delete(`/logins`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.text).toStrictEqual("");
      });
  });
  it("DELETE /logins (500) (Session save)", () => {
    const error = "LOGIN ERROR";
    mockSession.mockImplementationOnce((req, next) => {
      jest.spyOn(req.session, "save").mockImplementationOnce((err) => {
        console.log("HEEEEELP");
        if (err) err(new Error("Help"));

        return req.session;
      });
      req.session.username = mocked_username;
      next();
    });
    return request(mocked_app)
      .delete(`/logins`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
      });
  });
  it("DELETE /logins (500) (Session regenerate)", () => {
    const error = "LOGIN ERROR";
    mockSession.mockImplementationOnce((req, next) => {
      jest.spyOn(req.session, "regenerate").mockImplementationOnce((err) => {
        err(new Error("Help"));

        return req.session;
      });
      req.session.username = mocked_username;
      next();
    });
    return request(mocked_app)
      .delete(`/logins`)
      .set("Accept", "application/json")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("Content-Length", error.length.toString())
      .expect(500)
      .then((response) => {
        expect(response.text).toStrictEqual(error);
      });
  });
});
