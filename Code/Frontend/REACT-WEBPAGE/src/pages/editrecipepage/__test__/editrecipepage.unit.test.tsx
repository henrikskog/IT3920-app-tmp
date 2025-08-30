import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import recipeService from "../../../services/recipeservice";
import { FullRecipe, Ingredient, UnitIngredient } from "../../../types";
//import userEvent from "@testing-library/user-event";
import { EditRecipePage } from "../editrecipepage";
import { UserContext } from "../../../context";
import ingredientService from "../../../services/ingredientservice";
import imageService from "../../../services/imageservice";

const recipe: FullRecipe = {
  title: "Spaghetti",
  id: 0,
  image_id: 0,
  username: "Granny Smith",
  date: "2020.22.02",
  description: "Such good spaghetti",
  recipe: [
    { step: 2, instruction: "Melt Butter" },
    { step: 1, instruction: "Grind Butter" },
    { step: 3, instruction: "Bake Butter" },
  ],
  ingredients: [
    {
      ingredient: "Tomato",
      amount: 2,
      unit: "KiloGram",
      kcal100gr: 100,
      stdunits: ["Kilogram", "Stykk"],
    },
    {
      ingredient: "Cucumber",
      amount: 1,
      unit: "Stykk",
      kcal100gr: 50,
      stdunits: ["Kilogram", "Stykk"],
    },
  ],
};

const ingredients: Ingredient[] = [
  {
    ingredient: "Milk",
    kcal100gr: 240,
    stdunits: ["Kilogram", "Liter"],
  },
  {
    ingredient: "Cereal",
    kcal100gr: 260,
    stdunits: ["Kilogram", "Liter"],
  },
  {
    ingredient: "Tomato",
    kcal100gr: 100,
    stdunits: ["Kilogram", "Stykk"],
  },
  {
    ingredient: "Cucumber",
    kcal100gr: 50,
    stdunits: ["Kilogram", "Stykk"],
  },
];

jest.spyOn(recipeService, "get").mockResolvedValue(recipe);
jest.spyOn(ingredientService, "getAll").mockResolvedValue(ingredients);
jest
  .spyOn(imageService, "get")
  .mockResolvedValue(new Blob([Buffer.from([0x20])]));

const mockedNavigate = jest.fn();
const mockedParams = jest.fn(
  () =>
    ({
      recipe_id: undefined,
    } as {
      recipe_id: undefined | string;
    })
);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useParams: () => mockedParams(),
}));

window.URL.createObjectURL = jest.fn(() => "URL");
window.URL.revokeObjectURL = jest.fn();

function unitIngExists(unitIng: UnitIngredient) {
  expect(
    screen.getByTestId(`${unitIng.ingredient} ingredient`)
  ).toBeInTheDocument();
  /*  expect(
    screen.getByTestId(`${unitIng.ingredient} kcal100gr`)
  ).toBeInTheDocument(); */
  expect(
    screen.getByTestId(`${unitIng.ingredient} amount`)
  ).toBeInTheDocument();
  expect(screen.getByTestId(`${unitIng.ingredient} unit`)).toBeInTheDocument();
}

function unitIngCorrectText(unitIng: UnitIngredient) {
  expect(
    screen.getByTestId(`${unitIng.ingredient} ingredient`)
  ).toHaveTextContent(unitIng.ingredient);
  /* expect(
    screen.getByTestId(`${unitIng.ingredient} kcal100gr`)
  ).toHaveTextContent(unitIng.kcal100gr.toString()); */
  expect(screen.getByTestId(`${unitIng.ingredient} amount`)).toHaveTextContent(
    unitIng.amount.toString()
  );
  expect(screen.getByTestId(`${unitIng.ingredient} unit`)).toHaveTextContent(
    unitIng.unit
  );
}

function ingExists(ing: Ingredient) {
  expect(
    screen.getByTestId(`${ing.ingredient} ingredient`)
  ).toBeInTheDocument();
  //expect(screen.getByTestId(`${ing.ingredient} kcal100gr`)).toBeInTheDocument();
  expect(() => screen.getByTestId(`${ing.ingredient} amount`)).toThrow();
  expect(() => screen.getByTestId(`${ing.ingredient} unit`)).toThrow();
}

function ingCorrectText(ing: Ingredient) {
  expect(screen.getByTestId(`${ing.ingredient} ingredient`)).toHaveTextContent(
    ing.ingredient
  );
  /* expect(screen.getByTestId(`${ing.ingredient} kcal100gr`)).toHaveTextContent(
    ing.kcal100gr.toString()
  ); */
}

describe("Edit Recipe Page unit test (Create)", () => {
  it("Should render correctly", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <EditRecipePage />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(recipeService.get).toHaveBeenCalledTimes(0);
    });

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledWith();
    });

    /* 
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(recipes[0].image);
    */

    expect(screen.getByTestId("recipe input alt text")).toBeInTheDocument();

    expect(screen.getByTestId("recipe image")).toBeInTheDocument();

    expect(screen.getByTestId("recipe input image")).toBeInTheDocument();

    expect(screen.getByTestId("recipe input title")).toBeInTheDocument();

    expect(screen.queryByTestId("recipe button save")).not.toBeInTheDocument();

    expect(screen.getByTestId("recipe button create")).toBeInTheDocument();
    expect(screen.getByTestId("recipe button create")).toHaveTextContent(
      "Create Recipe"
    );

    expect(screen.getByTestId("recipe button cancel")).toBeInTheDocument();
    expect(screen.getByTestId("recipe button cancel")).toHaveTextContent(
      "Cancel"
    );
    // Plus one due to Recipe Step Widget

    expect(screen.getByTestId(`Add New Ingredients`)).toBeInTheDocument();
    expect(screen.getByTestId(`Add New Ingredients`)).toHaveTextContent(
      "Add New Ingredients"
    );
    expect(screen.getByTestId(`Your Ingredients`)).toBeInTheDocument();
    expect(screen.getByTestId(`Your Ingredients`)).toHaveTextContent(
      "Your Ingredients"
    );

    expect(screen.getByTestId(`recipe step textarea add`)).toBeInTheDocument();

    expect(screen.getByTestId(`recipe step button add`)).toBeInTheDocument();
    expect(screen.getByTestId(`recipe step button add`)).toHaveTextContent(
      "Add Step"
    );

    expect(() => ingExists(ingredients[0])).not.toThrow();
    expect(() => ingCorrectText(ingredients[0])).not.toThrow();
    expect(() => ingExists(ingredients[1])).not.toThrow();
    expect(() => ingCorrectText(ingredients[1])).not.toThrow();

    recipe.ingredients.forEach((i) => {
      expect(() => unitIngCorrectText(i)).toThrow();
      expect(() => ingExists(i)).not.toThrow();
      expect(() => ingCorrectText(i)).not.toThrow();
    });

    recipe.recipe.forEach((r) => {
      expect(
        screen.queryByTestId(`recipe step textarea ${r.step}`)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`recipe step button delete ${r.step}`)
      ).not.toBeInTheDocument();
    });
  });

  it("Should go to Login Page if not logged in", async () => {
    const User = { name: "", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <EditRecipePage />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledWith();
    });

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});

describe("Edit Recipe Page unit test (Edit)", () => {
  it("Should render correctly", async () => {
    mockedParams.mockImplementation(
      () =>
        ({
          recipe_id: "0",
        } as {
          recipe_id: undefined | string;
        })
    );
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <EditRecipePage />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(recipeService.get).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledTimes(2);
    });
    expect(ingredientService.getAll).toHaveBeenCalledWith();

    /* 
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(recipes[0].image);
    */

    expect(screen.getByTestId("recipe input alt text")).toBeInTheDocument();

    expect(screen.getByTestId("recipe image")).toBeInTheDocument();

    expect(screen.getByTestId("recipe input image")).toBeInTheDocument();

    expect(screen.getByTestId("recipe input title")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("recipe input title")).getByDisplayValue(
        recipe.title
      )
    ).toHaveValue(recipe.title);

    expect(
      screen.queryByTestId("recipe button create")
    ).not.toBeInTheDocument();

    expect(screen.getByTestId("recipe button save")).toBeInTheDocument();
    expect(screen.getByTestId("recipe button save")).toHaveTextContent(
      "Save Changes"
    );

    expect(screen.getByTestId("recipe button cancel")).toBeInTheDocument();
    expect(screen.getByTestId("recipe button cancel")).toHaveTextContent(
      "Cancel"
    );

    expect(screen.getByTestId(`Add New Ingredients`)).toBeInTheDocument();
    expect(screen.getByTestId(`Add New Ingredients`)).toHaveTextContent(
      "Add New Ingredients"
    );
    expect(screen.getByTestId(`Your Ingredients`)).toBeInTheDocument();
    expect(screen.getByTestId(`Your Ingredients`)).toHaveTextContent(
      "Your Ingredients"
    );

    expect(screen.getByTestId(`recipe step textarea add`)).toBeInTheDocument();

    expect(screen.getByTestId(`recipe step button add`)).toBeInTheDocument();
    expect(screen.getByTestId(`recipe step button add`)).toHaveTextContent(
      "Add Step"
    );

    expect(() => ingExists(ingredients[0])).not.toThrow();
    expect(() => ingCorrectText(ingredients[0])).not.toThrow();
    expect(() => ingExists(ingredients[1])).not.toThrow();
    expect(() => ingCorrectText(ingredients[1])).not.toThrow();

    recipe.ingredients.forEach((i) => {
      expect(() => unitIngExists(i)).not.toThrow();
      expect(() => unitIngCorrectText(i)).not.toThrow();
      expect(() => ingExists(i)).toThrow();
    });

    recipe.recipe.forEach((r) => {
      expect(
        within(
          screen.getByTestId(`recipe step textarea ${r.step}`)
        ).getByDisplayValue(r.instruction)
      ).toBeInTheDocument();
      expect(
        within(
          screen.getByTestId(`recipe step textarea ${r.step}`)
        ).getByDisplayValue(r.instruction)
      ).toHaveValue(r.instruction);
      expect(
        screen.getByTestId(`recipe step button delete ${r.step}`)
      ).toBeInTheDocument();
    });
  });

  it("Should go to Login Page if not logged in", async () => {
    const User = { name: "", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <EditRecipePage />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledWith();
    });

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});
