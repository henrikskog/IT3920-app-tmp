import express from "express";
import { shoppinglistService } from "../services/shoppinglistservice.js";
import { isAuthenticated } from "../middleware.js";
import { Shopping_list, Shopping_list_item } from "../types.js";
import { recipeService } from "../services/recipeservice.js";
//import { Shopping_list } from "../types";

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, async (req, res) => {
    // Gets shoppinglist data

    try {
      console.log(`ShoppingList, GET: ${req.url}`);

      const username = req.session.username as string;

      console.log(username);
      const shoppingList = await shoppinglistService.getRecipes(username);
      const recipes = await Promise.all(
        shoppingList.map((s) => recipeService.get(s.recipe_id))
      );
      const recipesIngredients = await Promise.all(
        shoppingList.map((s) => shoppinglistService.getIngredients(s.id))
      );

      const shoppingListData: Shopping_list = shoppingList
        .map((s, i) => {
          if (!(recipes[i].length && recipesIngredients[i].length)) {
            return;
          }
          return {
            id: s.id,
            recipe: recipes[i][0],
            ingredients: recipesIngredients[i],
          };
        })
        .filter((i) => i) as Shopping_list_item[];

      console.log(
        `Shoppinglist Data: `,
        shoppingListData,
        recipes,
        recipesIngredients
      );
      res.status(200).json(shoppingListData);
    } catch (error) {
      console.error(`Failed to get shopping list data: `, error);
      res.status(500).send("Failed to get shopping list data");
    }
  })
  .post(isAuthenticated, (req, res) => {
    // Creates a new shoppinglist

    console.log(`ShoppingList, POST: ${req.url}`);
    const recipe_id = Number(req.body.recipe_id);
    const username = req.session.username as string;

    shoppinglistService
      .create(username, recipe_id)
      .then(() => {
        res.status(201).send();
      })
      .catch((error) => {
        console.error(`Failed to create shoppinglist: `, error);
        res.status(500).send("Failed to create shoppinglist");
      });
  });

router.route("/:shopping_list_id").delete(isAuthenticated, (req, res) => {
  // Deletes a shoppinglist

  console.log(`ShoppingList, DELETE: ${req.url}`);
  const username = req.session.username as string;
  const shopping_list_id = Number(req.params.shopping_list_id);

  shoppinglistService
    .delete(username, shopping_list_id)
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      console.error(`Failed to delete shoppinglist: `, error);
      res.status(500).send("Failed to delete shoppinglist");
    });
});

const shoppingListRouter = router;
console.log("Shoppinglist router created");
export { shoppingListRouter };
