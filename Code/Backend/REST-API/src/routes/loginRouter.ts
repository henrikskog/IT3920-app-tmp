import express from "express";
import { isAuthenticated } from "../middleware.js";
import { loginService } from "../services/loginservice.js";
import { Login } from "../types.js";

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, (req, res) => {
    console.log(`Login, GET: ${req.url}`);
    console.log(req.session.username);
    res.status(200).json({ username: req.session.username });
  })
  .post((req, res, next) => {
    console.log(`Login, POST: ${req.url}`);
    try {
      const login: Login = req.body;

      if (!login.username || !login.password)
        return res.status(400).send("Write a username and a password!");

      req.session.regenerate(function (err) {
        if (err) return next(err);
        loginService
          .auth(login.username, login.password)
          .then((isAuthed) => {
            if (isAuthed) {
              req.session.username = login.username;
              req.session.save(function (err) {
                if (err) return next(err);

                console.log("AUTHED");
                res.status(201).json({ username: req.session.username });
              });
            } else {
              res.status(401).send("Login unsuccessful");
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("LOGIN ERROR");
          });
      });
    } catch (err) {
      res.status(500).send("LOGIN ERROR");
    }
  })
  .delete(isAuthenticated, (req, res, next) => {
    console.log(`Login, DELETE: ${req.url}`);

    req.session.username = "";
    req.session.save(function (err) {
      if (err) return next(err);
      req.session.username = "";
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) return next(err);
        res.status(200).send();
      });
    });
  });

const loginRouter = router;
export { loginRouter };
