import React from "react";
import { FridgePage } from "../fridgepage";
import { render, screen, waitFor, within } from "@testing-library/react";
import { Ingredient, UnitIngredient } from "../../../types";
import fridgeService from "../../../services/fridgeservice";
import { UserContext } from "../../../context";
import userEvent from "@testing-library/user-event";
import ingredientService from "../../../services/ingredientservice";

const ingredients: UnitIngredient[] = [
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
  {
    ingredient: "Milk",
    amount: 300,
    unit: "Liter",
    kcal100gr: 240,
    stdunits: ["Kilogram", "Liter"],
  },
];

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// When mocking object's with functions, aka class methods
// use spyOn from jest
jest
  .spyOn(fridgeService, "get")
  .mockImplementation(() => Promise.resolve(ingredients));
jest.spyOn(fridgeService, "update").mockResolvedValue(undefined);
jest.spyOn(fridgeService, "add").mockResolvedValue(undefined);
jest.spyOn(fridgeService, "remove").mockResolvedValue(undefined);

const Ings: Ingredient[] = [
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
    `Amount: ${unitIng.amount}`
  );
  expect(screen.getByTestId(`${unitIng.ingredient} unit`)).toHaveTextContent(
    `Unit: ${unitIng.unit}`
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
  /*  expect(screen.getByTestId(`${ing.ingredient} kcal100gr`)).toHaveTextContent(
    ing.kcal100gr.toString()
  ); */
}

jest.spyOn(ingredientService, "getAll").mockResolvedValue(Ings);

describe("Fridge unit test", () => {
  it("Should render correctly", async () => {
    const user = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={user}>
        <FridgePage />
      </UserContext.Provider>
    );

    // Using useEffect needs this to be able to render
    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(user.name);

    // Use toBeInTheDocument() to check if the element exists

    expect(
      screen.getByTestId("fridge button Add/Remove Ingredient")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("fridge button Add/Remove Ingredient")
    ).toHaveTextContent("Add/Remove Ingredient");

    expect(() => screen.getAllByText("+")).toThrow();
    expect(() => screen.getAllByText("-")).toThrow();

    ingredients.forEach((ingredient) => {
      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });
  });
  it("Should go to Login Page if not logged in", () => {
    const User = { name: "", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
  it("Should render correctly after hitting add/remove button", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    // Using useEffect needs this to be able to render
    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(User.name);

    // Use toBeInTheDocument() to check if the element exists

    await user.click(screen.getByTestId("fridge button Add/Remove Ingredient"));

    ingredients.forEach((ingredient) => {
      expect(
        screen.getByTestId(`${ingredient.ingredient} button +`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${ingredient.ingredient} button -`)
      ).toBeInTheDocument();

      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });

    expect(() => ingExists(Ings[1])).not.toThrow();
    expect(() => ingCorrectText(Ings[1])).not.toThrow();
    expect(
      screen.getByTestId(`${Ings[1].ingredient} button Add`)
    ).toBeInTheDocument();
  });

  it("Should render correctly increasing or decreasing amounts", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(User.name);

    await user.click(screen.getByTestId("fridge button Add/Remove Ingredient"));

    await user.click(
      screen.getByTestId(`${ingredients[0].ingredient} button +`)
    );

    await user.click(
      screen.getByTestId(`${ingredients[1].ingredient} button -`)
    );

    await user.click(
      screen.getByTestId(`${ingredients[2].ingredient} button -`)
    );

    const changedIngredients = [...ingredients].map((i, index) => {
      switch (index) {
        case 0:
          return { ...ingredients[0], amount: ingredients[0].amount + 1 };
        case 1:
          return { ...ingredients[1], amount: ingredients[1].amount };
        case 2:
          return { ...ingredients[2], amount: ingredients[2].amount - 1 };
        default:
          return i;
      }
    });
    changedIngredients.forEach((ingredient) => {
      expect(
        screen.getByTestId(`${ingredient.ingredient} button +`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${ingredient.ingredient} button -`)
      ).toBeInTheDocument();

      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });
  });

  it("Should render correctly after saving increase or decrease of amount", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    // Using useEffect needs this to be able to render
    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(User.name);

    // Use toBeInTheDocument() to check if the element exists

    await user.click(screen.getByTestId("fridge button Add/Remove Ingredient"));

    /*  console.log(screen.getByRole("button", { name: "+" })) */
    await user.click(
      screen.getByTestId(`${ingredients[0].ingredient} button +`)
    );
    await user.click(
      screen.getByTestId(`${ingredients[2].ingredient} button -`)
    );
    await user.click(screen.getByTestId(`fridge button Confirm`));

    expect(fridgeService.add).toHaveBeenCalledTimes(0);
    expect(fridgeService.update).toHaveBeenCalledTimes(1);
    expect(fridgeService.update).toHaveBeenCalledWith(User.name, [
      {
        ingredient: ingredients[0].ingredient,
        unit: ingredients[0].unit,
        amount: ingredients[0].amount + 1,
      },
      {
        ingredient: ingredients[2].ingredient,
        unit: ingredients[2].unit,
        amount: ingredients[2].amount - 1,
      },
    ]);

    const changedIngredients = [...ingredients].map((i, index) => {
      switch (index) {
        case 0:
          return { ...ingredients[0], amount: ingredients[0].amount + 1 };
        case 2:
          return { ...ingredients[2], amount: ingredients[2].amount - 1 };
        default:
          return i;
      }
    });

    changedIngredients.forEach((ingredient) => {
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button +`)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button -`)
      ).not.toBeInTheDocument();

      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });
  });

  it("Should render correctly after canceling increase or decrease of amount", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    // Using useEffect needs this to be able to render
    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(User.name);

    // Use toBeInTheDocument() to check if the element exists

    await user.click(screen.getByTestId("fridge button Add/Remove Ingredient"));

    await user.click(
      screen.getByTestId(`${ingredients[0].ingredient} button +`)
    );

    await user.click(screen.getByTestId(`fridge button Cancel`));

    ingredients.forEach((ingredient) => {
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button +`)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button -`)
      ).not.toBeInTheDocument();

      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });
  });

  it("Should render correctly adding ingredient", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    // Using useEffect needs this to be able to render
    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(User.name);

    // Use toBeInTheDocument() to check if the element exists

    await user.click(screen.getByTestId("fridge button Add/Remove Ingredient"));

    expect(
      screen.getByTestId(`${Ings[1].ingredient} button Add`)
    ).toBeInTheDocument();

    await user.click(screen.getByTestId(`${Ings[1].ingredient} button Add`));

    expect(
      screen.queryByTestId(`${Ings[1].ingredient} button Add`)
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId(`${Ings[1].ingredient} button +`));

    expect(
      within(
        screen.getByTestId(`${Ings[1].ingredient} changeamount`)
      ).getByDisplayValue("1")
    ).toHaveDisplayValue("1");

    await user.click(
      within(screen.getByTestId(`${Ings[1].ingredient} select`)).getByRole(
        "combobox"
      )
    );

    await user.click(
      screen.getByTestId(`${Ings[1].ingredient} option ${Ings[1].stdunits[0]}`)
    );

    await user.click(
      screen.getByTestId(`${Ings[1].ingredient} button Add Ingredient`)
    );

    [
      ...ingredients,
      {
        ...Ings[1],
        amount: 1,
        unit: Ings[1].stdunits[0],
      },
    ].forEach((ingredient) => {
      expect(
        screen.getByTestId(`${ingredient.ingredient} button +`)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${ingredient.ingredient} button -`)
      ).toBeInTheDocument();

      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });
  });

  it("Should render correctly after saving adding ingredient", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    // Using useEffect needs this to be able to render
    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(User.name);

    // Use toBeInTheDocument() to check if the element exists

    await user.click(screen.getByTestId("fridge button Add/Remove Ingredient"));

    expect(screen.getAllByText("Add")).toHaveLength(1);

    await user.click(screen.getByTestId(`${Ings[1].ingredient} button Add`));

    expect(
      screen.queryByTestId(`${Ings[1].ingredient} button Add`)
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId(`${Ings[1].ingredient} button +`));

    expect(
      within(
        screen.getByTestId(`${Ings[1].ingredient} changeamount`)
      ).getByDisplayValue("1")
    ).toHaveDisplayValue("1");

    await user.click(
      within(screen.getByTestId(`${Ings[1].ingredient} select`)).getByRole(
        "combobox"
      )
    );

    await user.click(
      screen.getByTestId(`${Ings[1].ingredient} option ${Ings[1].stdunits[0]}`)
    );

    await user.click(
      screen.getByTestId(`${Ings[1].ingredient} button Add Ingredient`)
    );
    await user.click(screen.getByTestId(`fridge button Confirm`));

    expect(fridgeService.add).toHaveBeenCalledTimes(1);
    expect(fridgeService.update).toHaveBeenCalledTimes(0);
    expect(fridgeService.remove).toHaveBeenCalledTimes(0);

    expect(fridgeService.add).toHaveBeenCalledWith(User.name, [
      { ingredient: Ings[1].ingredient, unit: Ings[1].stdunits[0], amount: 1 },
    ]);
    [
      ...ingredients,
      {
        ...Ings[1],
        amount: 1,
        unit: Ings[1].stdunits[0],
      },
    ].forEach((ingredient) => {
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button +`)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button -`)
      ).not.toBeInTheDocument();

      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });
  });

  it("Should render correctly after canceling adding ingredient", async () => {
    const User = { name: "Adrian", setName: jest.fn() };
    render(
      <UserContext.Provider value={User}>
        <FridgePage />
      </UserContext.Provider>
    );

    const user = userEvent.setup();

    // Using useEffect needs this to be able to render
    await waitFor(() => {
      expect(fridgeService.get).toHaveBeenCalledTimes(1);
    });

    expect(fridgeService.get).toHaveBeenCalledWith(User.name);

    // Use toBeInTheDocument() to check if the element exists

    await user.click(screen.getByTestId("fridge button Add/Remove Ingredient"));

    expect(screen.getAllByText("Add")).toHaveLength(1);

    await user.click(screen.getByTestId(`${Ings[1].ingredient} button Add`));

    expect(
      screen.queryByTestId(`${Ings[1].ingredient} button Add`)
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId(`${Ings[1].ingredient} button +`));

    expect(
      within(
        screen.getByTestId(`${Ings[1].ingredient} changeamount`)
      ).getByDisplayValue("1")
    ).toHaveDisplayValue("1");

    await user.click(
      within(screen.getByTestId(`${Ings[1].ingredient} select`)).getByRole(
        "combobox"
      )
    );

    await user.click(
      screen.getByTestId(`${Ings[1].ingredient} option ${Ings[1].stdunits[0]}`)
    );

    await user.click(
      screen.getByTestId(`${Ings[1].ingredient} button Add Ingredient`)
    );
    await user.click(screen.getByTestId(`fridge button Cancel`));

    expect(fridgeService.add).toHaveBeenCalledTimes(0);
    expect(fridgeService.update).toHaveBeenCalledTimes(0);
    expect(fridgeService.remove).toHaveBeenCalledTimes(0);

    expect(() =>
      unitIngExists({ ...Ings[1], unit: "Kilogram", amount: 1 })
    ).toThrow();

    ingredients.forEach((ingredient) => {
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button +`)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(`${ingredient.ingredient} button -`)
      ).not.toBeInTheDocument();

      expect(() => unitIngExists(ingredient)).not.toThrow();
      expect(() => unitIngCorrectText(ingredient)).not.toThrow();
    });
  });
});
