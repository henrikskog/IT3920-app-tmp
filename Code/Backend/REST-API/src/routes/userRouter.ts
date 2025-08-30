import express from "express";
import { userService } from "../services/userservice.js";
import { UserCreate } from "../types.js";

const router = express.Router();

router.route("/").post((req, res) => {
  console.log(`User, POST: ${req.url}`);

  const newUser: UserCreate = req.body;

  if (newUser?.image_id === undefined || !newUser?.name || !newUser?.password)
    return res.status(400).send("image, name or password was not sent");

  userService
    .create(newUser)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to create user");
    });
});

router.route("/:username").get((req, res) => {
  console.log(`User, GET: ${req.url}`);
  const username = req.params.username;
  userService
    .get(username)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    });
});

const userRouter = router;
export { userRouter };
