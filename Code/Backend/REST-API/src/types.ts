// Misc types:

export interface Image {
  image: Buffer;
  type: string;
}

export interface Rating {
  rating: number;
}

export interface RatingCreate {
  rating: number;
  recipe_id: number;
}

export interface RatingUpdate {
  rating?: number;
}

export interface Favorite {
  recipe_id: number;
}

// Ingredient types:

export interface SQLIngredient {
  ingredient: string;
  kcalper100gram: number;
  stdunits: string;
  sakkarids?: number;
  proteins?: number;
  fat?: number;
}

export interface Ingredient {
  ingredient: string;
  kcalper100gram: number;
  stdunits: string[];
  sakkarids?: number;
  proteins?: number;
  fat?: number;
}

export interface SimpleUnitIngredient {
  ingredient: string;
  amount: number;
  unit: string;
}

export interface UnitIngredient extends Ingredient, SimpleUnitIngredient {}

// Recipe types:

export interface Step {
  step: number;
  instruction: string;
}

export interface FullRecipe extends DisplayRecipe {
  ingredients: UnitIngredient[];
  recipe: Step[];
}

export interface DisplayRecipe extends BaseRecipe {
  id: number;
  image_id: number;
  date: Date;
}

interface BaseRecipe {
  username: string;
  title: string;
  description: string;
}

export interface RecipeCreate extends RecipeUpdate {
  title: string;
  description: string;
  image_id: number;
  ingredients: SimpleUnitIngredient[];
  recipe: Step[];
}

export interface RecipeUpdate {
  title?: string;
  description?: string;
  image_id?: number;
  ingredients?: SimpleUnitIngredient[];
  recipe?: Step[];
}

// Shopping list types:

export type Shopping_list = Shopping_list_item[];

export interface Shopping_list_item {
  id: number;
  recipe: DisplayRecipe;
  ingredients: SimpleUnitIngredient[];
}

export interface Shopping_list_base {
  id: number;
  recipe_id: number;
}

// User types:

export interface User {
  name: string;
  image_id: number;
}

export interface UserCreate extends User {
  password: string;
}

export interface UserUpdate {
  name?: string;
  password?: string;
  image_id?: number;
}

export interface Login {
  username: string;
  password: string;
}
