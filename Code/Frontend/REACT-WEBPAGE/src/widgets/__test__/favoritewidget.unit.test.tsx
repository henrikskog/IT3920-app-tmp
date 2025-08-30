import React from "react";
import { render, screen } from "@testing-library/react";
import { FavoriteWidget } from "../favoritewidget";
import { UserContext } from "../../context";
import favoriteService from "../../services/favoriteservice";
import userEvent from "@testing-library/user-event";
import { DisplayRecipe } from "../../types";

const mockRecipe: DisplayRecipe = {
  id: 1,
  title: "Test Recipe",
  date: "2022.02.02",
  username: "testuser",
  image_id: 0,
  description: "This is a test recipe",
};

jest.spyOn(console, "error");

jest.spyOn(favoriteService, "isFavorite").mockResolvedValue(false);
jest.spyOn(favoriteService, "create").mockResolvedValue(undefined);
jest.spyOn(favoriteService, "delete").mockResolvedValue(mockRecipe.id);

const User = { name: "Adrian", setName: jest.fn() };

describe("FavoriteWidget Component", () => {
  it("should render correctly", () => {
    render(<FavoriteWidget recipe={mockRecipe} />);

    expect(screen.getByTestId("FavoriteIcon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should toggle favorite state on button clicks", async () => {
    render(
      <UserContext.Provider value={User}>
        <FavoriteWidget recipe={mockRecipe} />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button"));

    expect(favoriteService.create).toHaveBeenCalledTimes(1);
    expect(favoriteService.create).toHaveBeenCalledWith(
      User.name,
      mockRecipe.id
    );

    await user.click(screen.getByRole("button"));

    expect(favoriteService.create).toHaveBeenCalledTimes(1);

    expect(favoriteService.delete).toHaveBeenCalledTimes(1);
    expect(favoriteService.delete).toHaveBeenCalledWith(mockRecipe.id);
  });

  it("should not toggle favorite state if user is not logged in", async () => {
    render(<FavoriteWidget recipe={mockRecipe} />);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button"));

    expect(console.error).toHaveBeenCalledWith("not logged in");
    expect(favoriteService.create).not.toHaveBeenCalled();
    expect(favoriteService.delete).not.toHaveBeenCalled();
  });
  it("Should catch error when create or delete throws", async () => {
    render(
      <UserContext.Provider value={User}>
        <FavoriteWidget recipe={mockRecipe} />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    jest.spyOn(favoriteService, "delete").mockRejectedValueOnce("AHAH");

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(console.error).toHaveBeenCalledWith(
      `error toggling favorite: ${mockRecipe.id}`,
      "AHAH"
    );

    jest.spyOn(favoriteService, "create").mockRejectedValueOnce("HAHA");
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(console.error).toHaveBeenCalledWith(
      `error toggling favorite: ${mockRecipe.id}`,
      "HAHA"
    );

    expect(favoriteService.create).toHaveBeenCalledTimes(2);
    expect(favoriteService.delete).toHaveBeenCalledTimes(2);
  });
});
