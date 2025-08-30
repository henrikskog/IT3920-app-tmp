import express from "express";
import { recipeService } from "../services/recipeservice.js";
import { FullRecipe, RecipeCreate, RecipeUpdate } from "../types.js";
import { isAuthenticated } from "../middleware.js";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    // Gets all recipes

    console.log(`Recipe, GET: ${req.url}`);
    recipeService
      .getAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.error(`Error getting all recipes:`, error);
        res.status(500).send("Error getting all recipes");
      });
  })

  .post(isAuthenticated, (req, res) => {
    // Posts a new recipe

    console.log(`Recipe, POST: ${req.url}`);
    const rawdata = req.body;

    if (!rawdata?.recipe || !rawdata?.ingredients)
      return res.status(400).send("Recipe or Ingredients not defined");

    const data: RecipeCreate = rawdata;

    console.log(data);

    recipeService
      .create(req.session.username as string, data)
      .then((id) => {
        res.status(201).json({ id: id });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to create recipe");
      });
  });

router
  .route("/:recipe_id")
  .get(async (req, res) => {
    // Gets a specific recipe

    console.log(`Recipe, GET: ${req.url}`);
    const id = Number(req.params.recipe_id);
    console.log(`Recipe id: `, id);

    try {
      const [recipe, ingredients, steps] = await Promise.all([
        recipeService.get(id),
        recipeService.getIngredients(id),
        recipeService.getSteps(id),
      ]);

      if (recipe.length === 0) {
        console.error("No recipe to get");
        return res.status(404).send("Error getting recipe");
      }

      console.log(`Getting recipe: `, recipe);
      console.log(`Getting ingredients: `, ingredients);
      console.log(`Getting steps: `, steps);

      const fullRecipe: FullRecipe = {
        ...recipe[0],
        ingredients: ingredients,
        recipe: steps,
      };

      console.log(fullRecipe);

      res.status(200).json(fullRecipe);
    } catch (error) {
      console.error(`Failed to get recipe: `, error);
      res.status(500).send("Error getting recipe");
    }
  })

  .patch(isAuthenticated, (req, res) => {
    // Updates a specific recipe

    console.log(`Recipe, PATCH: ${req.url}`);
    const recipe_id = Number(req.params.recipe_id);
    const data: RecipeUpdate = req.body;

    console.log(data, req.session.username);
    recipeService
      .update(req.session.username as string, recipe_id, data)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        console.error(`Failed to update recipe: `, error);
        res.status(500).send("Failed to update recipe");
      });
  })

  .delete(isAuthenticated, (req, res) => {
    // Deletes a specific recipe

    console.log(`Recipe, DELETE: ${req.url}`);
    const params = req.params;

    const recipe_id = Number(params.recipe_id);
    recipeService
      .delete(recipe_id)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        console.error(`Failed to delete recipe:`, error);
        res.status(500).send("Failed to delete recipe");
      });
  });

router.route("/:recipe_id/rating").get((req, res) => {
  console.log(`Recipe, GET: ${req.url}`);
  const recipe_id = Number(req.params.recipe_id);

  recipeService
    .getRating(recipe_id)
    .then((data) => {
      if (data.length === 0 || data[0].rating == null)
        return res.status(404).send("ERROR 404");
      res.status(200).json(data[0]);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("ERROR");
    });
});

const recipeRouter = router;
console.log("Recipe router created");
export { recipeRouter };
