import { QueryError } from "mysql2";
import {
  DisplayRecipe,
  Favorite,
  FullRecipe,
  Image,
  Ingredient,
  Login,
  Rating,
  RatingCreate,
  RecipeCreate,
  RecipeUpdate,
  SQLIngredient,
  Shopping_list_base,
  Shopping_list_item,
  SimpleUnitIngredient,
  Step,
  UnitIngredient,
  User,
  UserCreate,
} from "../types.js";
export const mocked_username = "Ola Nordmann";

export const image: Image = {
  image: Buffer.from([0x20]),
  type: "image/png",
};

export const rating: Rating = {
  rating: 3,
};

export const floatrating: Rating = {
  rating: 2.7,
};

export const ingredients: Ingredient[] = [
  {
    ingredient: "Flour",
    kcalper100gram: 500,
    stdunits: ["Stykk", "Kilogram"],
  },
  {
    ingredient: "Cucumber",
    kcalper100gram: 400,
    stdunits: ["Stykk", "Kilogram"],
  },
  {
    ingredient: "Milk",
    kcalper100gram: 240,
    stdunits: ["Liter", "Stykk"],
  },
  {
    ingredient: "Tomato",
    kcalper100gram: 200,
    stdunits: ["Stykk", "Kilogram"],
  },
];

export const simple_ingredients: SimpleUnitIngredient[] = [
  {
    ingredient: "Flour",
    amount: 2,
    unit: "KiloGram",
  },
  {
    ingredient: "Cucumber",
    amount: 1,
    unit: "Stykk",
  },
  {
    ingredient: "Milk",
    amount: 300,
    unit: "Liter",
  },
];

export const unit_ingredients: UnitIngredient[] = [
  {
    ingredient: "Tomato",
    amount: 2,
    unit: "KiloGram",
    kcalper100gram: 100,
    stdunits: ["Stykk", "Kilogram"],
  },
  {
    ingredient: "Cucumber",
    amount: 1,
    unit: "Stykk",
    kcalper100gram: 50,
    stdunits: ["Liter", "Stykk"],
  },
  {
    ingredient: "Milk",
    amount: 300,
    unit: "Liter",
    kcalper100gram: 240,
    stdunits: ["Liter", "Stykk"],
  },
];

export const recipe: DisplayRecipe = {
  title: "Spaghetti",
  id: 0,
  image_id: 1,
  username: "Granny Smith",
  date: new Date("2024-03-21T18:53:32.000Z"),
  description: "Such good spaghetti",
};

export const favorite: Favorite = {
  recipe_id: recipe.id,
};

export const steps: Step[] = [
  { step: 1, instruction: "Grind Butter" },
  { step: 2, instruction: "Melt Butter" },
  { step: 3, instruction: "Bake Butter" },
];

export const full_recipe: FullRecipe = {
  ...recipe,
  recipe: steps,
  ingredients: unit_ingredients,
};

export const create_recipe: RecipeCreate = {
  title: recipe.title,
  description: recipe.description,
  image_id: recipe.image_id,
  ingredients: simple_ingredients,
  recipe: steps,
};

export const update_recipe: RecipeUpdate = {
  title: recipe.title,
  description: recipe.description,
  image_id: recipe.image_id,
  ingredients: simple_ingredients,
  recipe: steps,
};

export const query_error: QueryError = {
  code: "SELECT BITCH",
  fatal: true,
  name: "Bruh",
  message: "Error",
};

export const error_401 = "Error 401 Unauthorized";

export const sql_ingredients: SQLIngredient[] = ingredients.map((i) => ({
  ...i,
  stdunits: JSON.stringify(i.stdunits),
}));

export const create_rating: RatingCreate = { rating: 4, recipe_id: recipe.id };

export const shopping_list_base: Shopping_list_base = {
  recipe_id: recipe.id,
  id: 2,
};

export const shopping_list_item: Shopping_list_item = {
  id: shopping_list_base.id,
  recipe: recipe,
  ingredients: simple_ingredients,
};

export const create_shopping_list: { recipe_id: number } = {
  recipe_id: recipe.id,
};

export const mocked_password = "Cisco";

export const mocked_user: User = {
  name: mocked_username,
  image_id: recipe.image_id,
};

export const respone_user: { username: string } = { username: mocked_username };

export const mocked_login: Login = {
  username: mocked_username,
  password: mocked_password,
};

export const create_user: UserCreate = {
  name: mocked_username,
  password: mocked_password,
  image_id: recipe.image_id,
};

export const mocked_hash = "This is hashed";
