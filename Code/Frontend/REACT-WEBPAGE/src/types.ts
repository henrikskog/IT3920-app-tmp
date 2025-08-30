// Misc types:

export type ImageFile = File;

export interface ImageBlob {
  image: ArrayBuffer;
  type: string;
}

export interface Rating {
  rating: number;
}

export interface Favorite {
  recipe_id: number;
}

// Ingredient types:

export interface Ingredient {
  ingredient: string;
  kcal100gr: number;
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
  userrating?: number;
}

export interface DisplayRecipe extends BaseRecipe {
  id: number;
  image_id: number;
  date: string;
}

interface BaseRecipe {
  username: string;
  title: string;
  description: string;
}

export interface RecipeCreate extends RecipeUpdate {
  title: string;
  description: string;
  ingredients: SimpleUnitIngredient[];
  recipe: Step[];
}

export interface RecipeUpdate {
  image_id?: number;
  title?: string;
  description?: string;
  ingredients?: SimpleUnitIngredient[];
  recipe?: Step[];
}

// Shopping list types:

export type Shopping_list = Shopping_list_item[];

export interface Shopping_list_item {
  id: number;
  username: string;
  recipe: DisplayRecipe;
  ingredients: SimpleUnitIngredient[];
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
  name: string;
  new_name?: string;
  new_password?: string;
  new_image: ImageFile;
}
