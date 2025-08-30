import React from "react";
import { Root } from "../root";
import { render, screen } from "@testing-library/react";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Root unit test", () => {
  it("Should render landing page correctly", () => {
    render(<Root />);

    expect(screen.getByTestId("navbar icon hamburger")).toBeInTheDocument();
    expect(screen.getByTestId("navbar button Login")).toBeInTheDocument();
    expect(screen.getByTestId("navbar button Login")).toHaveTextContent(
      "Login"
    );
  });
});
