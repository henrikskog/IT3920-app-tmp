import { DisplayRecipe } from "../types";

export function filterRecipeReducer(
  recipes: DisplayRecipe[],
  action: { type: string; filters: string[]; recipes: DisplayRecipe[] }
) {
  if (action.filters.length === 0) {
    throw Error();
  }
  switch (action.type) {
    case "combined": {
      let filteredRecipes = action.recipes;
      for (const filter of action.filters) {
        switch (filter) {
          case "a-z": {
            filteredRecipes = filteredRecipes.sort();
            break;
          }
          case "z-a": {
            filteredRecipes = filteredRecipes.sort().reverse();
            break;
          }
          default: {
            throw Error();
          }
        }
      }
      return filteredRecipes;
    }
    case "search": {
      return action.recipes.filter(
        (r) =>
          r.title.includes(action.filters[0]) ||
          r.description.includes(action.filters[0]) ||
          r.username.includes(action.filters[0]) ||
          new Date(r.date).toLocaleDateString().includes(action.filters[0])
      );
    }
    default: {
      throw Error();
    }
  }
}
