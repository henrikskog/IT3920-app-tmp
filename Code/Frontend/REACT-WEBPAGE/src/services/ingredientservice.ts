import axios from "axios";
import { Ingredient } from "../types";

async function getAll() {
  const response = await axios.get<Ingredient[]>(`/ingredients`);
  return response.data;
}

async function create(request: Ingredient) {
  const response = await axios.post(`/ingredients`, request);
  return response.data;
}

async function get(ingredient: string) {
  const response = await axios.get(`/ingredients/${ingredient}`);
  return response.data;
}

const ingredientService = { create, getAll, get };

export default ingredientService;
