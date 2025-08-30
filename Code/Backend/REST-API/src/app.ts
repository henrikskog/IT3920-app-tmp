import express from "express";

import session from "express-session";
const app = express();

app.use(express.json());

// Defining username for use of sessiondata checking
declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

const sess = {
  secret: "keyboard cat",
  resave: false,
  cookie: { secure: false, httpOnly: true, path: "/" },
  saveUninitialized: true,
};

/* if (app.get("env") === "production") {
  //app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
} */

app.use(session(sess));

import cors from "cors";

const allowedOrigins = ["http://localhost"];

app.options("/api/v1", cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/v1", cors({ origin: allowedOrigins, credentials: true }));

import apiRouter from "./apirouter.js";

app.use("/api/v1", apiRouter);

export { app };
