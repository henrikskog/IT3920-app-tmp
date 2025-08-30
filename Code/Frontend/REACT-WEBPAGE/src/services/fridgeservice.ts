import axios from "axios";
import { SimpleUnitIngredient, UnitIngredient } from "../types";

/* 
  Maybe Username should be the tell of the fridges? Feels kinda redundant to 
  have fridge_id, when username always goes to the same fridge_id 
*/

async function getIngredients(username: string) {
  const response = await axios.get<UnitIngredient[]>(`/fridges/${username}`);
  return response.data;
}

/* 
  This is interesting. Every action from add, update and remove could
  nearly be one function which simply sends requests with the updated
  amount and the server could create, modify or delete depending on
  the sent amount is
*/

async function addIngredients(username: string, request: SimpleUnitIngredient[]) {
  const response = await axios.post(`/fridges/${username}`, request);
  return response.data;
}

async function updateIngredients(
  username: string,
  request: SimpleUnitIngredient[]
) {
  const response = await axios.patch(`/fridges/${username}`, request);
  return response.data;
}

// Removes
async function removeIngredient(
  username: string,
  { ingredient }: SimpleUnitIngredient
) {
  const response = await axios.delete(
    `/fridges/${username}/ingredients/${ingredient}`
  );
  return response.data;
}

const fridgeService = {
  get: getIngredients,
  add: addIngredients,
  update: updateIngredients,
  remove: removeIngredient,
};

export default fridgeService;
