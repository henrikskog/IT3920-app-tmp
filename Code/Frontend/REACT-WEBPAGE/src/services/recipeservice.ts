import axios from "axios";
import {
  DisplayRecipe,
  RecipeUpdate,
  FullRecipe,
  RecipeCreate,
} from "../types";

/* 
  Maybe Username should be the tell of the fridges? Feels kinda redundant to 
  have fridge_id, when username always goes to the same fridge_id 
*/

async function getAll() {
  const response = await axios.get<DisplayRecipe[]>(`/recipes`);
  return response.data;
}

async function create(request: RecipeCreate) {
  const response = await axios.post<{ id: number }>(`/recipes`, request);
  return response.data.id;
}

async function get(recipe_id: number) {
  const response = await axios.get<FullRecipe>(`/recipes/${recipe_id}`);
  return response.data;
}

async function update(recipe_id: number, request: RecipeUpdate) {
  const response = await axios.patch(`/recipes/${recipe_id}`, request);
  return response.data;
}

async function remove(recipe_id: number) {
  const response = await axios.delete(`/recipes/${recipe_id}`);
  return response.data;
}

async function getIngredients(recipe_id: number) {
  const response = await axios.get(`/recipes/${recipe_id}/ingredients`);
  return response.data;
}

const recipeService = {
  get,
  getAll,
  create,
  update,
  remove,
  getIngredients,
};

export default recipeService;
