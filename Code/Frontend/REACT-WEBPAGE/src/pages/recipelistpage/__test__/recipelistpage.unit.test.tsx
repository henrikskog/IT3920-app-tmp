import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
//import userEvent from "@testing-library/user-event";
import recipeService from "../../../services/recipeservice";
import { RecipeListPage } from "../recipelistpage";
import userEvent from "@testing-library/user-event";
import { DisplayRecipe } from "../../../types";
import imageService from "../../../services/imageservice";
import favoriteService from "../../../services/favoriteservice";
const recipes: DisplayRecipe[] = [
  {
    title: "Spaghetti",
    id: 0,
    image_id: 0,
    username: "Granny Smith",
    date: "2020.22.02",
    description: "Such good spaghetti",
  },
];

const image: Blob = new Blob([Buffer.from([0x20])]);

jest.spyOn(recipeService, "getAll").mockResolvedValue(recipes);
jest.spyOn(imageService, "get").mockResolvedValue(image);
jest.spyOn(favoriteService, "isFavorite").mockResolvedValue(false);

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

window.URL.createObjectURL = jest.fn(() => "URL");
window.URL.revokeObjectURL = jest.fn();

describe("Recipe List Page unit test", () => {
  it("Should render correctly", async () => {
    render(<RecipeListPage />);

    await waitFor(() => {
      expect(recipeService.getAll).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(imageService.get).toHaveBeenCalled();
    });

    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(image);

    expect(
      screen.getByRole("heading", { name: "Recipes", level: 1 })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`${recipes[0].id} card header`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${recipes[0].id} card header`)
    ).toHaveTextContent(recipes[0].title);
    expect(screen.getByText(recipes[0].username[0])).toBeInTheDocument();
    expect(
      screen.getByText(new Date(recipes[0].date).toLocaleString())
    ).toBeInTheDocument();
    expect(screen.getByText(recipes[0].description)).toBeInTheDocument();
    expect(screen.getByTestId(`${recipes[0].id} image`)).toBeInTheDocument();
  });

  it("Should navigate to /profile when clicking profile", async () => {
    render(<RecipeListPage />);

    const user = userEvent.setup();
    await waitFor(() => {
      expect(recipeService.getAll).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(imageService.get).toHaveBeenCalled();
    });

    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(image);

    await user.click(screen.getByTestId(`${recipes[0].id} button profile`));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
    });
    expect(mockedNavigate).toHaveBeenCalledWith("/profile");
    expect(mockedNavigate).not.toHaveBeenCalledWith(
      `/recipes/${recipes[0].id}`
    );
  });

  it("Should navigate to recipe when clicking on the card", async () => {
    render(<RecipeListPage />);

    const user = userEvent.setup();
    await waitFor(() => {
      expect(recipeService.getAll).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(imageService.get).toHaveBeenCalled();
    });

    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(image);

    await user.click(screen.getByTestId(`${recipes[0].id} card header`));

    await user.click(screen.getByTestId(`${recipes[0].id} card`));

    await user.click(screen.getByTestId(`${recipes[0].id} image`));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(3);
    });
    expect(mockedNavigate).not.toHaveBeenCalledWith("/profile");
    expect(mockedNavigate).toHaveBeenCalledWith(`/recipes/${recipes[0].id}`);
  });

  it("Should clean up blobs when leaving page", async () => {
    const { unmount } = render(<RecipeListPage />);

    const user = userEvent.setup();
    await waitFor(() => {
      expect(recipeService.getAll).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(imageService.get).toHaveBeenCalled();
    });

    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(image);

    await user.click(screen.getByTestId(`${recipes[0].id} button profile`));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
    });

    unmount();

    expect(window.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("URL");
  });
});
