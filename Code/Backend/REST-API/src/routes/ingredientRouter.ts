import express from "express";
import { ingredientService } from "../services/ingredientservice.js";
import { Ingredient } from "../types.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    // Gets all ingredients

    console.log(`Ingredient, GET: ${req.url}`);
    ingredientService
      .getAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.error(`Error getting all ingredients: `, error);
        res.status(500).send("Error getting all ingredients");
      });
  })
  .post((req, res) => {
    // Posts a new ingredient

    console.log(`Ingredient, POST: ${req.url}`);
    const data: Ingredient = req.body;
    ingredientService
      .create(data)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        console.error(`Failed to create ingredient: `, error);
        res.status(500).send("Failed to create ingredient");
      });
  });

router.route("/:ingredient").get(async (req, res) => {
  // Gets an ingredient

  try {
    console.log(`Ingredient, GET: ${req.url}`);
    const ingredient = req.params.ingredient;
    console.log(`Ingredient name: `, ingredient);

    const data = await ingredientService.get(ingredient);

    if (data.length === 0) {
      console.error("No ingredient found");
      return res.status(404).send("Error getting ingredient");
    }

    console.log(`Getting ingredient `, data);
    res.status(200).json(data[0]);
  } catch (error) {
    console.error(`Error getting all ingredients: `, error);
    res.status(500).send("Error getting all ingredients");
  }
});

const ingredientRouter = router;
console.log("Ingredients router created");
export { ingredientRouter };
