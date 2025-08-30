import axios from "axios";
import { DisplayRecipe } from "../types";

async function getFavorites() {
  const response = await axios.get<DisplayRecipe[]>(`/favorites`);
  return response.data;
}

async function createFavorite(username: string, id: number) {
  const response = await axios.post(`/favorites`, {
    recipe_id: id,
    username: username,
  });
  return response.data;
}

async function get(recipe_id: number) {
  const response = await axios.get(`/favorites/recipes/${recipe_id}`);
  return response.data;
}

async function deleteFavorite(recipe_id: number) {
  const response = await axios.delete(`/favorites/recipes/${recipe_id}`);
  return response.data;
}

const favoriteService = {
  create: createFavorite,
  getAll: getFavorites,
  get: get,
  delete: deleteFavorite,
  isFavorite: get,
};

export default favoriteService;
