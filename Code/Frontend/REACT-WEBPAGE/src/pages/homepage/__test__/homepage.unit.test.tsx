import React from "react";
import { HomePage } from "../homepage";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("@mui/material/styles/styled")

describe("Homepage unit test", () => {
  it("Should render correctly", () => {
    render(<HomePage />);

    const list = [
      { testid: `Home button Favorite`, text: "Favorite Recipes" },
      { testid: `Home button Random`, text: "Random Recipe" },
      { testid: `Home button Fridge`, text: "My fridge" },
      { testid: `Home button Recipes`, text: "Recipes" },
      { testid: `Home button Shopping List`, text: "Shopping List" },
      { testid: `Home button What`, text: "My profile" },
    ];

    list.forEach((t) => {
      expect(screen.getByTestId(t.testid)).toBeInTheDocument();
      expect(screen.getByTestId(t.testid)).toHaveTextContent(t.text);
    });
  });

  it("Should fire event navigate", async () => {
    render(<HomePage />);

    const user = userEvent.setup();

    const list = [
      {
        testid: `Home button Favorite`,
        text: "Favorite Recipes",
        path: "/favorites",
      },
      {
        testid: `Home button Random`,
        text: "Random Recipe",
        path: "/recipes/2",
      },
      { testid: `Home button Fridge`, text: "My fridge", path: "/fridge" },
      { testid: `Home button Recipes`, text: "Recipes", path: "/recipes" },
      {
        testid: `Home button Shopping List`,
        text: "Shopping List",
        path: "/shoppinglist",
      },
      { testid: `Home button What`, text: "Profile", path: "/profile" },
    ];

    list.forEach(async (t) => await user.click(screen.getByTestId(t.testid)));
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledTimes(list.length)
    );
    list.forEach((t) => expect(mockedNavigate).toHaveBeenCalledWith(t.path));
  });
});
