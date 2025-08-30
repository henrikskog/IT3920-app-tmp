import React from "react";
import { NavBar } from "../navbar";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserContext } from "../../../context";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Navbar unit test (logged out)", () => {
  it("Should render correctly", () => {
    render(<NavBar />);

    expect(screen.getByTestId("navbar icon hamburger")).toBeInTheDocument();
    expect(screen.getByTestId("navbar button Home")).toBeInTheDocument();
    expect(screen.getByTestId("navbar button Login")).toBeInTheDocument();
    expect(screen.getByTestId("navbar button Login")).toHaveTextContent(
      "Login"
    );
  });

  it("Should be able to click login", async () => {
    render(<NavBar />);

    const user = userEvent.setup();

    await user.click(screen.getByTestId("navbar button Login"));

    expect(mockedNavigate).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });

  it("Should show hamburger after button click", async () => {
    render(<NavBar />);

    const user = userEvent.setup();

    await user.click(screen.getByTestId("navbar icon hamburger"));

    const texts = [
      "Home",
      "Login",
      "Fridge",
      "Shopping List",
      "Favorites",
      "Recipes",
      "Random recipe",
      /* "Calorie tracker", */
    ];

    expect(
      screen.queryByTestId(`navbar hamburger Profile`)
    ).not.toBeInTheDocument();

    texts.forEach((text) => {
      expect(
        screen.getByTestId(`navbar hamburger ${text}`)
      ).toBeInTheDocument();
    });
  });

  it("Should be able to click on all hamburger buttons", async () => {
    render(<NavBar />);

    const buttons = [
      { text: "Home", route: "/" },
      { text: "Login", route: "/login" },
      { text: "Fridge", route: "/fridge" },
      { text: "Shopping List", route: "/shoppinglist" },
      { text: "Favorites", route: "/favorites" },
      { text: "Recipes", route: "/recipes" },
      { text: "Random recipe", route: "/recipes" },
      /* { text: "Calorie tracker", route: "/calorietracker" }, */
    ];

    const user = userEvent.setup();

    await user.click(screen.getByTestId("navbar icon hamburger"));

    buttons.forEach(async (b) => {
      return await user.click(screen.getByTestId(`navbar hamburger ${b.text}`));
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(buttons.length);
    });
    buttons.forEach((b) => {
      expect(mockedNavigate).toHaveBeenCalledWith(b.route);
    });
  });
});

describe("Navbar unit test (logged in)", () => {
  it("Should render correctly", () => {
    const User = { name: "Adrian", setName: () => {} };
    render(
      <UserContext.Provider value={User}>
        <NavBar />
      </UserContext.Provider>
    );

    expect(screen.getByTestId("navbar icon hamburger")).toBeInTheDocument();
    expect(screen.getByTestId("navbar button Profile")).toBeInTheDocument();
    expect(screen.getByTestId("navbar button Profile")).toHaveTextContent(
      "Profile"
    );
  });

  it("Should be able to click profile", async () => {
    const User = { name: "Adrian", setName: () => {} };
    render(
      <UserContext.Provider value={User}>
        <NavBar />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    await user.click(screen.getByTestId("navbar button Profile"));

    expect(mockedNavigate).toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith("/profile");
  });

  it("Should show hamburger after button click", async () => {
    const User = { name: "Adrian", setName: () => {} };
    render(
      <UserContext.Provider value={User}>
        <NavBar />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    await user.click(screen.getByTestId("navbar icon hamburger"));

    const texts = [
      "Home",
      "Profile",
      "Fridge",
      "Shopping List",
      "Favorites",
      "Recipes",
      "Random recipe",
      /* "Calorie tracker", */
    ];

    expect(
      screen.queryByTestId(`navbar hamburger Login`)
    ).not.toBeInTheDocument();

    texts.forEach((text) => {
      expect(
        screen.getByTestId(`navbar hamburger ${text}`)
      ).toBeInTheDocument();
    });
  });
  it("Should be able to click on all hamburger buttons", async () => {
    const User = { name: "Adrian", setName: () => {} };
    render(
      <UserContext.Provider value={User}>
        <NavBar />
      </UserContext.Provider>
    );

    const buttons = [
      { text: "Home", route: "/" },
      { text: "Profile", route: "/profile" },
      { text: "Fridge", route: "/fridge" },
      { text: "Shopping List", route: "/shoppinglist" },
      { text: "Favorites", route: "/favorites" },
      { text: "Recipes", route: "/recipes" },
      { text: "Random recipe", route: "/recipes" },
      /* { text: "Calorie tracker", route: "/calorietracker" }, */
    ];

    const user = userEvent.setup();

    await user.click(screen.getByTestId("navbar icon hamburger"));

    buttons.forEach(async (b) => {
      return await user.click(screen.getByTestId(`navbar hamburger ${b.text}`));
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(buttons.length);
    });
    buttons.forEach((b) => {
      expect(mockedNavigate).toHaveBeenCalledWith(b.route);
    });
  });
});
