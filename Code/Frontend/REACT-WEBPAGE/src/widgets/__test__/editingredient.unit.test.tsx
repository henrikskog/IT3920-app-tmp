import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Ingredient, UnitIngredient } from "../../types";
import userEvent from "@testing-library/user-event";
import { EditIngredient } from "../editingredient";
import ingredientService from "../../services/ingredientservice";

jest.spyOn(console, "log");

const ingredients: UnitIngredient[] = [
  {
    ingredient: "Flour",
    amount: 2,
    unit: "KiloGram",
    kcal100gr: 100,
    stdunits: ["Kilogram", "Liter"],
  },
  {
    ingredient: "Cucumber",
    amount: 1,
    unit: "Stykk",
    kcal100gr: 50,
    stdunits: ["Stykk"],
  },
  {
    ingredient: "Milk",
    amount: 300,
    unit: "Liter",
    kcal100gr: 240,
    stdunits: ["Liter", "Kilogram"],
  },
];

const Ings: Ingredient[] = [
  {
    ingredient: "Milk",
    kcal100gr: 240,
    stdunits: ["Liter", "Kilogram"],
  },
  {
    ingredient: "Cereal",
    kcal100gr: 260,
    stdunits: ["Kilogram"],
  },
];

function unitIngExists(unitIng: UnitIngredient) {
  expect(
    screen.getByTestId(`${unitIng.ingredient} ingredient`)
  ).toBeInTheDocument();
  /* expect(
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
 /*  expect(screen.getByTestId(`${ing.ingredient} kcal100gr`)).toBeInTheDocument(); */
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

jest
  .spyOn(ingredientService, "getAll")
  .mockImplementation(() => Promise.resolve(Ings));

describe("Edit Ingredient Widget Unit Test", () => {
  it("Should render correctly", async () => {
    const ingreq = {
      add: jest.fn(() => {}),
      change: jest.fn(() => {}),
      delete: jest.fn(() => {}),
    };
    render(<EditIngredient ingredients={ingredients} ingreq={ingreq} />);

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId(`Add New Ingredients`)).toBeInTheDocument();
    expect(screen.getByTestId(`Your Ingredients`)).toBeInTheDocument();

    expect(() => ingExists(Ings[0])).toThrow();

    expect(() => ingExists(Ings[1])).not.toThrow();
    expect(() => ingCorrectText(Ings[1])).not.toThrow();

    ingredients.forEach((UnitIng) => {
      expect(() => unitIngExists(UnitIng)).not.toThrow();
      expect(() => unitIngCorrectText(UnitIng)).not.toThrow();
    });
  });
  it("Should call setIngredientRequests with RequestIngredients", async () => {
    const ingreq = {
      add: jest.fn(),
      change: jest.fn(),
      delete: jest.fn(),
    };
    const { rerender } = render(
      <EditIngredient ingredients={ingredients} ingreq={ingreq} />
    );

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledTimes(1);
    });

    const user = userEvent.setup();

    await user.click(
      screen.getByTestId(`${ingredients[0].ingredient} button +`)
    );

    const changedIngredient = {
      ...ingredients[0],
      amount: ingredients[0].amount + 1,
    };

    expect(ingreq.change).toHaveBeenCalledTimes(1);
    expect(ingreq.change).toHaveBeenCalledWith(changedIngredient);

    const changedIngredients = [...ingredients].map((i, index) =>
      index != 0 ? i : changedIngredient
    );

    rerender(
      <EditIngredient ingredients={changedIngredients} ingreq={ingreq} />
    );

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledTimes(2);
    });

    expect(() => unitIngCorrectText(ingredients[0])).toThrow();

    expect(() => unitIngExists(changedIngredient)).not.toThrow();
    expect(() => unitIngCorrectText(changedIngredient)).not.toThrow();
  });

  it("Should call useEffect after rerender", async () => {
    const ingreq = {
      add: jest.fn(),
      change: jest.fn(),
      delete: jest.fn(),
    };
    const { rerender } = render(
      <EditIngredient ingredients={ingredients} ingreq={ingreq} />
    );

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledTimes(1);
    });

    const ingredient: UnitIngredient = {
      ...Ings[1],
      amount: 4,
      unit: "Kilogram",
    };

    const changedIngredients = [...ingredients].map((i, index) =>
      index != 1 ? i : ingredient
    );

    rerender(
      <EditIngredient ingredients={changedIngredients} ingreq={ingreq} />
    );

    await waitFor(() => {
      expect(ingredientService.getAll).toHaveBeenCalledTimes(2);
    });

    changedIngredients.forEach((UnitIng) => {
      expect(() => unitIngExists(UnitIng)).not.toThrow();
      expect(() => unitIngCorrectText(UnitIng)).not.toThrow();
    });
  });
});
