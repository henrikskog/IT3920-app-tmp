import express from "express";
import { fridgeService } from "../services/fridgeservice.js";
import { SimpleUnitIngredient } from "../types.js";
import { isAuthenticated } from "../middleware.js";

const router = express.Router();

router
  .route("/:username")
  // Gets all ingredients from fridge
  .get(isAuthenticated, (req, res) => {
    console.log(`Fridges, GET: ${req.url}`);

    const username = req.session.username as string;

    fridgeService
      .get(username)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.error(`Error getting fridge ingredients:`, error);
        res.status(500).send("Error getting fridge ingredients");
      });
  })
  // Adds ingredients to fridge
  .post(isAuthenticated, async (req, res) => {
    console.log(`Fridges, POST: ${req.url}`);

    try {
      const username = req.session.username as string;
      const data: SimpleUnitIngredient[] = req.body;
      console.log(data);
      // Queries all the creation in promise wrappers
      const queries = data.map((i, index) =>
        fridgeService
          .create(username, i)
          .then(() => console.log(index, ` is finished`))
      );

      // Waits for every promise to succeed
      await Promise.all(queries);
      res.status(200).send();
    } catch (err) {
      console.error(`Failed to add ingredient in fridge: `, err);
      res.status(500).send("Failed to add ingredient to fridge");
    }
  })
  // Updates ingredients in fridge
  .patch(isAuthenticated, async (req, res) => {
    console.log(`Fridges, PATCH: ${req.url}`);

    try {
      const username = req.session.username as string;
      const data: SimpleUnitIngredient[] = req.body;

      // Queries all the updates in promise wrappers
      const queries = data.map((i, index) =>
        fridgeService
          .update(username, i)
          .then(() => console.log(index, ` is finished`))
      );

      // Waits for every promise to succeed
      await Promise.all(queries);
      res.status(200).send();
    } catch (err) {
      console.error(`Failed to update ingredient in fridge: `, err);
      res.status(500).send("Failed to update fridge ingredient");
    }
  });

router
  .route("/:username/ingredients/:ingredient")
  // Removes ingredient from fridge
  .delete(isAuthenticated, async (req, res) => {
    console.log(`Fridges, DELETE: ${req.url}`);

    try {
      const username = req.session.username as string;
      const ingredient = req.params.ingredient;

      await fridgeService.delete(username, ingredient);

      res.status(200).send();
    } catch (err) {
      console.error(`Failed to delete fridge ingredient: `, err);
      res.status(500).send("Failed to delete fridge ingredient");
    }
  });

const fridgeRouter = router;
console.log("Fridge router created");
export { fridgeRouter };
