import { UnitIngredient } from "../types";

export function ingredientsReducer(
  ingredients: UnitIngredient[],
  action: { type: string; ingreq: UnitIngredient } | { type: "reset" }
) {
  switch (action.type) {
    case "added": {
      return [...ingredients, action.ingreq];
    }
    case "changed": {
      return ingredients.map((i) => {
        if (i.ingredient == action.ingreq.ingredient) {
          return action.ingreq;
        } else {
          return i;
        }
      });
    }
    case "deleted": {
      return ingredients.filter(
        (i) => i.ingredient !== action.ingreq.ingredient
      );
    }
    case "reset": {
      return [];
    }
    default: {
      throw Error();
    }
  }
}
