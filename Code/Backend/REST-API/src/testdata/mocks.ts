import express from "express";
import session from "express-session";
import { fridgeService } from "../services/fridgeservice.js";
import {
  favorite,
  floatrating,
  image,
  mocked_hash,
  mocked_user,
  mocked_username,
  rating,
  recipe,
  shopping_list_base,
  simple_ingredients,
  steps,
  unit_ingredients,
} from "./mocktestdata.js";
import { ingredientService } from "../services/ingredientservice.js";
import { recipeService } from "../services/recipeservice.js";
import { userService } from "../services/userservice.js";
import { shoppinglistService } from "../services/shoppinglistservice.js";
import { loginService } from "../services/loginservice.js";
import { imageService } from "../services/imageservice.js";
import { ratingService } from "../services/ratingservice.js";
import { favoriteService } from "../services/favoriteservice.js";

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

const app = express();
app.use(express.json());

const sess = {
  secret: "keyboard cat",
  resave: false,
  cookie: { secure: false, httpOnly: true, path: "/" },
  saveUninitialized: true,
};

app.use(session(sess));

export const mockSession = jest.fn(
  (req: express.Request, next: express.NextFunction) => {
    req.session.username = mocked_username;
    next();
  }
);

app.use((req, res, next) => {
  mockSession(req, next);
});

export { app as mocked_app };

export function mock_fridgeService() {
  jest.spyOn(fridgeService, "get").mockResolvedValue(unit_ingredients);
  jest.spyOn(fridgeService, "create").mockResolvedValue();
  jest.spyOn(fridgeService, "update").mockResolvedValue();
  jest.spyOn(fridgeService, "delete").mockResolvedValue();
}

export function mock_ingredientService() {
  jest.spyOn(ingredientService, "getAll").mockResolvedValue(unit_ingredients);
  jest.spyOn(ingredientService, "get").mockResolvedValue(unit_ingredients);
  jest.spyOn(ingredientService, "create").mockResolvedValue();
}

export function mock_recipeService() {
  jest.spyOn(recipeService, "getAll").mockResolvedValue([recipe]);
  jest.spyOn(recipeService, "get").mockResolvedValue([recipe]);
  jest.spyOn(recipeService, "create").mockResolvedValue(1);
  jest.spyOn(recipeService, "update").mockResolvedValue();
  jest.spyOn(recipeService, "delete").mockResolvedValue();
  jest.spyOn(recipeService, "getSteps").mockResolvedValue(steps);
  jest
    .spyOn(recipeService, "getIngredients")
    .mockResolvedValue(unit_ingredients);
  jest.spyOn(recipeService, "getRating").mockResolvedValue([rating]);
}

export function mock_userService() {
  jest.spyOn(userService, "get").mockResolvedValue([mocked_user]);
  jest.spyOn(userService, "create").mockResolvedValue(4);
  jest.spyOn(userService, "delete").mockResolvedValue();
}

export function mock_shoppinglistService() {
  jest.spyOn(shoppinglistService, "bought").mockResolvedValue();
  jest.spyOn(shoppinglistService, "boughtAll").mockResolvedValue();
  jest.spyOn(shoppinglistService, "create").mockResolvedValue();
  jest.spyOn(shoppinglistService, "delete").mockResolvedValue();
  jest.spyOn(shoppinglistService, "deleteAll").mockResolvedValue();
  jest
    .spyOn(shoppinglistService, "getIngredients")
    .mockResolvedValue(simple_ingredients);
  jest
    .spyOn(shoppinglistService, "getRecipes")
    .mockResolvedValue([shopping_list_base]);
}

export function mock_loginService() {
  jest.spyOn(loginService, "auth").mockResolvedValue(true);
  jest.spyOn(loginService, "hash").mockResolvedValue(mocked_hash);
}

export function mock_imageService() {
  jest.spyOn(imageService, "create").mockResolvedValue(recipe.image_id);
  jest.spyOn(imageService, "get").mockResolvedValue([image]);
  jest.spyOn(imageService, "update").mockResolvedValue();
}

export function mock_ratingService() {
  jest.spyOn(ratingService, "getUserRating").mockResolvedValue([rating]);
  jest.spyOn(ratingService, "getAverage").mockResolvedValue([floatrating]);
  jest.spyOn(ratingService, "create").mockResolvedValue();
  jest.spyOn(ratingService, "update").mockResolvedValue();
  jest.spyOn(ratingService, "delete").mockResolvedValue();
}

export function mock_favoriteService() {
  jest.spyOn(favoriteService, "create").mockResolvedValue();
  jest.spyOn(favoriteService, "getAll").mockResolvedValue([recipe]);
  jest.spyOn(favoriteService, "get").mockResolvedValue([favorite]);
  jest.spyOn(favoriteService, "delete").mockResolvedValue();
}
