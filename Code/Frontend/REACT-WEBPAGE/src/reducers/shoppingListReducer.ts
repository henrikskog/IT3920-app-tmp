import { Shopping_list, Shopping_list_item } from "../types";

export function shoppingListReducer(
  shoppingList: Shopping_list,
  action:
    | { type: "added"; item: Shopping_list_item }
    | { type: "changed"; id: number; replacemment: Shopping_list_item }
    | { type: "deleted"; id: number }
    | { type: "set"; shopping_list: Shopping_list }
    | { type: "reset" }
) {
  switch (action.type) {
    case "added": {
      return [...shoppingList, action.item];
    }
    case "changed": {
      return shoppingList.map((s) =>
        s.id == action.id ? action.replacemment : s
      );
    }
    case "deleted": {
      return shoppingList.filter((s) => s.id != action.id);
    }
    case "set": {
      return action.shopping_list;
    }
    case "reset": {
      return [];
    }
    default: {
      throw Error("No Action done!");
    }
  }
}
