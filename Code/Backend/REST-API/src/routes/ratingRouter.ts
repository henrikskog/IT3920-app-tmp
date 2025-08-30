import express from "express";
import { isAuthenticated } from "../middleware.js";
import { ratingService } from "../services/ratingservice.js";
import { RatingCreate } from "../types.js";

const router = express.Router();

router.route("/").post(isAuthenticated, (req, res) => {
  console.log(`Rating, POST: ${req.url}`);
  const username = req.session.username as string;
  const data: RatingCreate = req.body;

  if (data.rating < 1 || data.rating > 5) {
    return res.status(400).send("ERROR 400");
  }

  ratingService
    .create(data.recipe_id, username, data.rating)
    .then(() => {
      res.status(201).send();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to create rating");
    });
});

router
  .route("/:recipe_id")
  .get(isAuthenticated, (req, res) => {
    console.log(`Rating, GET: ${req.url}`);
    const recipe_id = Number(req.params.recipe_id);
    const username = req.session.username as string;

    ratingService
      .getUserRating(recipe_id, username)
      .then((data) => {
        if (data.length === 0) return res.status(404).send();
        res.status(200).json(data[0]);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to get rating");
      });
  })
  .patch(isAuthenticated, (req, res) => {
    console.log(`Rating, PATCH: ${req.url}`);
    const recipe_id = Number(req.params.recipe_id);
    const username = req.session.username as string;
    const rating: number = Number(req.body.rating);

    if (rating < 1 || rating > 5) {
      return res.status(400).send("ERROR 400");
    }

    ratingService
      .update(recipe_id, username, rating)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to update rating");
      });
  })
  .delete(isAuthenticated, (req, res) => {
    console.log(`Rating, DELETE: ${req.url}`);
    const recipe_id = Number(req.params.recipe_id);
    const username = req.session.username as string;
    ratingService
      .delete(recipe_id, username)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to remove rating");
      });
  });

export const ratingRouter = router;
