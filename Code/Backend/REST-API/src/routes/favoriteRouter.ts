import express from "express";
import { favoriteService } from "../services/favoriteservice.js";
import { isAuthenticated } from "../middleware.js";

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, (req, res) => {
    // Gets all favorites
    console.log(`Favorite, GET: ${req.url}`);
    const username = req.session.username as string;

    favoriteService
      .getAll(username)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.error(`Error getting all favorites: `, error);
        res.status(500).send("Error getting all favorites");
      });
  })
  .post(isAuthenticated, (req, res) => {
    // Creates a new favorite

    console.log(`Favorite, POST: ${req.url}`);
    const recipe_id = Number(req.body.recipe_id);
    const username = req.session.username as string;

    favoriteService
      .create(username, recipe_id)
      .then(() => {
        res.status(201).send();
      })
      .catch((error) => {
        console.error(`Failed to create favorite: `, error);
        res.status(500).send("Failed to create favorite");
      });
  });

router
  .route("/recipes/:recipe_id")
  .get(isAuthenticated, (req, res) => {
    // Gets a favorite (Usually used for checking if favorited)
    console.log(`Favorite, GET: ${req.url}`);
    const username = req.session.username as string;
    const recipe_id = Number(req.params.recipe_id);
    favoriteService
      .get(username, recipe_id)
      .then((data) => {
        if (data.length === 0) return res.status(404).send();
        res.status(200).json(data);
      })
      .catch((error) => {
        console.error(`Failed to get favorite: `, error);
        res.status(500).send("Failed to get favorite");
      });
  })
  .delete(isAuthenticated, (req, res) => {
    // Deletes favorite

    console.log(`Favorite, DELETE: ${req.url}`);
    const username = req.session.username as string;
    const recipe_id = Number(req.params.recipe_id);
    favoriteService
      .delete(username, recipe_id)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        console.error(`Failed to delete favorite: `, error);
        res.status(500).send("Failed to delete favorite");
      });
  });

const favoriteRouter = router;
console.log("Favorite router created");
export { favoriteRouter };
