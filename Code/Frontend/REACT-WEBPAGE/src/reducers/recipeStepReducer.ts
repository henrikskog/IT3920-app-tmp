
export function recipeStepsReducer(
  recipeSteps: string[],
  action:
    | { type: "added"; recreq: string }
    | { type: "changed"; recreq: string; index: number }
    | { type: "deleted"; index: number }
    | { type: "reset" }
) {
  switch (action.type) {
    case "added": {
      return [...recipeSteps, action.recreq];
    }
    case "changed": {
      return recipeSteps.map((r, i) => {
        if (i == action.index) {
          return action.recreq;
        } else {
          return r;
        }
      });
    }
    case "deleted": {
      return recipeSteps.filter((r, i) => i !== action.index);
    }
    case "reset": {
      return [];
    }
    default: {
      throw Error();
    }
  }
}
