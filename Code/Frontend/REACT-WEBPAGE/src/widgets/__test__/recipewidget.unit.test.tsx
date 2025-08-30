import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { RecipeWidget } from "../recipewidget";
import userEvent from "@testing-library/user-event";
import { DisplayRecipe } from "../../types";
import imageService from "../../services/imageservice";
import favoriteService from "../../services/favoriteservice";

const mockRecipe: DisplayRecipe = {
  id: 1,
  title: "Test Recipe",
  date: "2022.02.02",
  username: "testuser",
  image_id: 0,
  description: "This is a test recipe",
};

jest
  .spyOn(imageService, "get")
  .mockResolvedValue(new Blob([Buffer.from([0x20])]));
jest.spyOn(favoriteService, "isFavorite").mockResolvedValue(false);

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

window.URL.createObjectURL = jest.fn(() => "URL");
window.URL.revokeObjectURL = jest.fn();

describe("Recipe Widget Unit Test", () => {
  it("Should render correctly", async () => {
    render(<RecipeWidget recipe={mockRecipe} />);

    await waitFor(() => {
      expect(imageService.get).toHaveBeenCalled();
    });

    expect(
      screen.getByTestId(`${mockRecipe.id} card header`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${mockRecipe.id} card header`)
    ).toHaveTextContent(new Date(mockRecipe.date).toLocaleString());
    expect(
      screen.getByTestId(`${mockRecipe.id} card header`)
    ).toHaveTextContent(mockRecipe.title);
  });

  it("Should navigate to recipe details page on click", async () => {
    render(<RecipeWidget recipe={mockRecipe} />);

    await waitFor(() => {
      expect(imageService.get).toHaveBeenCalled();
    });

    const user = userEvent.setup();

    await user.click(screen.getByTestId(`${mockRecipe.id} image`));

    expect(mockedNavigate).toHaveBeenCalledWith(`/recipes/${mockRecipe.id}`);
  });

  it("Should navigate to user profile on avatar click", async () => {
    render(<RecipeWidget recipe={mockRecipe} />);

    await waitFor(() => {
      expect(imageService.get).toHaveBeenCalled();
    });

    const user = userEvent.setup();
    await user.click(screen.getByTestId(`${mockRecipe.id} button profile`));

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledTimes(1));
    expect(mockedNavigate).toHaveBeenCalledWith("/profile");
  });
});
