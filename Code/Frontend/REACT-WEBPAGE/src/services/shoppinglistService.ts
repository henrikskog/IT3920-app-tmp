import axios from "axios";
import { Shopping_list, Shopping_list_item } from "../types";
import fridgeService from "./fridgeservice";

async function get() {
  const response = await axios.get<Shopping_list>(`/shoppinglist`);
  return response.data;
}

async function create(username: string, recipe_id: number) {
  await axios.post(`/shoppinglist`, {
    recipe_id: recipe_id,
    username: username,
  });
  return;
}

async function remove(shopping_list_id: number) {
  await axios.delete(`/shoppinglist/${shopping_list_id}`);
  return;
}

async function removeAll(shopping_list: Shopping_list) {
  await Promise.all(shopping_list.map((s) => remove(s.id)));
  return;
}

async function buy(username: string, shopping_list_item: Shopping_list_item) {
  await fridgeService.add(username, shopping_list_item.ingredients);
  await remove(shopping_list_item.id);
  return;
}

async function buyAll(username: string, shopping_list: Shopping_list) {
  await Promise.all(shopping_list.map((s) => buy(username, s)));
  return;
}

const shoppinglistService = {
  get,
  create,
  remove,
  removeAll,
  buy,
  buyAll,
};

export default shoppinglistService;
