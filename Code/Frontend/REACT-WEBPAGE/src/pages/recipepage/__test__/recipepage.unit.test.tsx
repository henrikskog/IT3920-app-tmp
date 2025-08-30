import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import recipeService from "../../../services/recipeservice";
import { FullRecipe } from "../../../types";
import userEvent from "@testing-library/user-event";
import { RecipePage } from "../recipepage";
import { UserContext } from "../../../context";
import favoriteService from "../../../services/favoriteservice";
import imageService from "../../../services/imageservice";
const recipe: FullRecipe = {
  title: "Spaghetti",
  id: 0,
  image_id: 0,
  username: "Granny Smith",
  date: "2020.22.02",
  description: "Such good spaghetti",
  recipe: [
    { step: 1, instruction: "Grind Butter" },
    { step: 2, instruction: "Melt Butter" },
    { step: 3, instruction: "Bake Butter" },
  ],
  ingredients: [
    {
      ingredient: "Tomato",
      amount: 2,
      unit: "Kilogram",
      kcal100gr: 100,
      stdunits: ["Stykk", "Kilogram"],
    },
    {
      ingredient: "Cucumber",
      amount: 1,
      unit: "Stykk",
      kcal100gr: 50,
      stdunits: ["Stykk", "Kilogram"],
    },
  ],
};

jest.spyOn(recipeService, "get").mockResolvedValue(recipe);

jest
  .spyOn(imageService, "get")
  .mockResolvedValue(new Blob([Buffer.from([0x20])]));
jest.spyOn(favoriteService, "isFavorite").mockResolvedValue(false);

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  useParams: () => ({
    recipe_id: "0",
  }),
}));

window.URL.createObjectURL = jest.fn(() => "URL");
window.URL.revokeObjectURL = jest.fn();

describe("Recipe Page unit test", () => {
  it("Should render correctly", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <RecipePage />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(recipeService.get).toHaveBeenCalledTimes(1);
    });
    expect(recipeService.get).toHaveBeenCalledWith(recipe.id);
    /* 
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(recipe.image);
 */
    expect(() => screen.getByRole("button", { name: "Edit" })).toThrow();

    expect(
      screen.getByRole("heading", { name: recipe.title, level: 2 })
    ).toBeInTheDocument();

    expect(screen.getByTestId("recipe-image")).toBeInTheDocument();

    expect(screen.getAllByRole("list")).toHaveLength(2);

    recipe.ingredients.forEach((i) => {
      expect(
        screen.getByRole("listitem", {
          name: `${i.ingredient}`,
        })
      ).toBeInTheDocument();
    });

    recipe.recipe.forEach((r) => {
      expect(
        screen.getByRole("listitem", {
          name: `Step ${r.step}`,
        })
      ).toHaveTextContent(r.instruction);
    });
  });
  it("Should render button when owner of recipe", async () => {
    const User = { name: "Granny Smith", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <RecipePage />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(recipeService.get).toHaveBeenCalledTimes(1);
    });
    expect(recipeService.get).toHaveBeenCalledWith(recipe.id);

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
  it("Should navigate when pressing edit button", async () => {
    const User = { name: "Granny Smith", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <RecipePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    await waitFor(() => {
      expect(recipeService.get).toHaveBeenCalledTimes(1);
    });
    expect(recipeService.get).toHaveBeenCalledWith(recipe.id);

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith(`/recipes/${recipe.id}/edit`);
  });
});
