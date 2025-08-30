import axios from "axios";
import { Rating } from "../types";

async function create(recipe_id: number, rating: number) {
  const response = await axios.post(`/ratings`, {
    recipe_id: recipe_id,
    rating: rating,
  });
  return response.data;
}

async function getUserRating(recipe_id: number) {
  const response = await axios.get<Rating>(`/ratings/${recipe_id}`);
  return response.data;
}

async function update(recipe_id: number, rating: number) {
  const response = await axios.patch(`/ratings/${recipe_id}`, {
    rating: rating,
  });
  return response.data;
}

async function remove(recipe_id: number) {
  const response = await axios.delete(`/ratings/${recipe_id}`);
  return response.data;
}

async function getAvg(recipe_id: number) {
  const response = await axios.get<Rating>(`/recipes/${recipe_id}/rating`);
  return response.data;
}

const ratingService = { remove, getAvg, getUserRating, create, update };

export default ratingService;
