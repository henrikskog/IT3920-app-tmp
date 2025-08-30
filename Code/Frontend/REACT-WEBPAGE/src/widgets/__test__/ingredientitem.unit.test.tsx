import React from "react";
import { render, screen, within } from "@testing-library/react";
import { IngredientItem } from "../ingredientitem";
import { Ingredient, UnitIngredient } from "../../types";
import userEvent from "@testing-library/user-event";

jest.spyOn(console, "log");

const UnitIng: UnitIngredient = {
  ingredient: "Tomato",
  unit: "Piece",
  kcal100gr: 100,
  amount: 20,
  stdunits: ["Stykk"],
};

const Ing: Ingredient = {
  ingredient: "Tomato",
  kcal100gr: 100,
  stdunits: ["Stykk", "Liter"],
};

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
  /* expect(screen.getByTestId(`${ing.ingredient} kcal100gr`)).toBeInTheDocument(); */
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

describe("Ingredient Item Widget Unit Test", () => {
  it("Should render correctly (UnitIngredient)", () => {
    render(<IngredientItem ingredient={UnitIng} type="display" />);

    expect(() => unitIngExists(UnitIng)).not.toThrow();
    expect(() => unitIngCorrectText(UnitIng)).not.toThrow();
  });
  it("Should render correctly (Ingredient)", () => {
    render(<IngredientItem ingredient={Ing} type="display" />);

    expect(() => ingExists(Ing)).not.toThrow();
    expect(() => ingCorrectText(Ing)).not.toThrow();
  });
  it("Should show buttons when changeIngReq is defined", () => {
    const dummy = { change: jest.fn(), add: () => {}, delete: () => {} };
    render(
      <IngredientItem ingredient={UnitIng} IngReq={dummy} type={"change"} />
    );

    expect(() => unitIngExists(UnitIng)).not.toThrow();
    expect(() => unitIngCorrectText(UnitIng)).not.toThrow();
    expect(
      screen.getByTestId(`${Ing.ingredient} button +`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${Ing.ingredient} button -`)
    ).toBeInTheDocument();
  });
  it("Should call changeIngReq when clicking buttons", async () => {
    const dummy = jest.fn();
    const changeIng = { change: dummy, add: () => {}, delete: () => {} };
    const { rerender } = render(
      <IngredientItem ingredient={UnitIng} IngReq={changeIng} type={"change"} />
    );

    expect(() => unitIngExists(UnitIng)).not.toThrow();
    expect(() => unitIngCorrectText(UnitIng)).not.toThrow();
    const user = userEvent.setup();
    await user.click(screen.getByTestId(`${Ing.ingredient} button +`));

    const changedIng = { ...UnitIng, amount: UnitIng.amount + 1 };
    expect(dummy).toHaveBeenCalledTimes(1);
    expect(dummy).toHaveBeenCalledWith(changedIng);

    rerender(
      <IngredientItem
        ingredient={changedIng}
        IngReq={changeIng}
        type={"change"}
      />
    );

    expect(() => unitIngExists(changedIng)).not.toThrow();
    expect(() => unitIngCorrectText(changedIng)).not.toThrow();

    await user.click(screen.getByTestId(`${Ing.ingredient} button -`));

    expect(dummy).toHaveBeenCalledTimes(2);
    expect(dummy).toHaveBeenCalledWith(UnitIng);

    rerender(
      <IngredientItem ingredient={UnitIng} IngReq={changeIng} type={"change"} />
    );

    expect(() => unitIngExists(UnitIng)).not.toThrow();
    expect(() => unitIngCorrectText(UnitIng)).not.toThrow();
  });
  it("Should not be able to go zero or negative in amount", async () => {
    const changingIng = {
      ...UnitIng,
    };
    const dummy = jest.fn((i) => {
      changingIng.amount = i.amount;
    });
    const changeIng = { change: dummy, add: () => {}, delete: () => {} };
    const { rerender } = render(
      <IngredientItem
        ingredient={changingIng}
        IngReq={changeIng}
        type={"change"}
      />
    );

    expect(() => unitIngExists(UnitIng)).not.toThrow();
    expect(() => unitIngCorrectText(UnitIng)).not.toThrow();

    const user = userEvent.setup();
    for (let i = 0; i < 50; i++) {
      await user.click(screen.getByTestId(`${Ing.ingredient} button -`));
    }
    const changedIng = {
      ...UnitIng,
      amount: 1,
    };
    expect(dummy).toHaveBeenCalledTimes(UnitIng.amount - 1);
    expect(dummy).toHaveBeenCalledWith(changedIng);

    rerender(
      <IngredientItem
        ingredient={changedIng}
        IngReq={changeIng}
        type={"change"}
      />
    );

    expect(() => unitIngExists(changedIng)).not.toThrow();
    expect(() => unitIngCorrectText(changedIng)).not.toThrow();
  });

  it("Should render show button when addIngReq is defined", () => {
    const dummy = jest.fn();
    const addIng = { add: dummy, change: () => {}, delete: () => {} };
    render(<IngredientItem ingredient={Ing} IngReq={addIng} type="add" />);

    expect(() => ingExists(Ing)).not.toThrow();
    expect(() => ingCorrectText(Ing)).not.toThrow();
    expect(
      screen.getByTestId(`${Ing.ingredient} button Add`)
    ).toBeInTheDocument();
  });

  it("Should render add-menu when add button is pressed", async () => {
    const dummy = jest.fn();
    const addIng = { add: dummy, change: () => {}, delete: () => {} };
    render(<IngredientItem ingredient={Ing} IngReq={addIng} type="add" />);

    expect(() => ingExists(Ing)).not.toThrow();
    expect(() => ingCorrectText(Ing)).not.toThrow();
    expect(
      screen.getByTestId(`${Ing.ingredient} button Add`)
    ).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(screen.getByTestId(`${Ing.ingredient} button Add`));

    expect(() => ingExists(Ing)).not.toThrow();
    expect(() => ingCorrectText(Ing)).not.toThrow();
    expect(() => screen.getByTestId(`${Ing.ingredient} button Add`)).toThrow();
    expect(
      screen.getByTestId(`${Ing.ingredient} button +`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${Ing.ingredient} button -`)
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${Ing.ingredient} select`)).toBeInTheDocument();
    /* Ing.stdunits.forEach((u) =>
      expect(
        screen.getByTestId(`${Ing.ingredient} option ${u}`)
      ).toBeInTheDocument()
    ); */
    expect(
      screen.getByTestId(`${Ing.ingredient} button Add Ingredient`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${Ing.ingredient} button Cancel`)
    ).toBeInTheDocument();
  });

  it("Should go back when pressing cancel or add ingredient button", async () => {
    const dummy = jest.fn();
    const addIng = { add: dummy, change: () => {}, delete: () => {} };
    render(
      <IngredientItem ingredient={Ing} IngReq={addIng} type="add" />
    );
    const user = userEvent.setup();

    await user.click(screen.getByTestId(`${Ing.ingredient} button Add`));

    expect(
      screen.getByTestId(`${Ing.ingredient} button Add Ingredient`)
    ).toBeInTheDocument();

    await user.click(screen.getByTestId(`${Ing.ingredient} button +`));

    await user.click(
      within(screen.getByTestId(`${Ing.ingredient} select`)).getByRole(
        "combobox"
      )
    );

    await user.click(
      screen.getByTestId(`${Ing.ingredient} option ${Ing.stdunits[0]}`)
    );

    await user.click(
      screen.getByTestId(`${Ing.ingredient} button Add Ingredient`)
    );

    expect(
      screen.getByTestId(`${Ing.ingredient} button Add`)
    ).toBeInTheDocument();

    await user.click(screen.getByTestId(`${Ing.ingredient} button Add`));

    expect(
      screen.getByTestId(`${Ing.ingredient} button Cancel`)
    ).toBeInTheDocument();

    await user.click(screen.getByTestId(`${Ing.ingredient} button Cancel`));

    expect(
      screen.getByTestId(`${Ing.ingredient} button Add`)
    ).toBeInTheDocument();
  });

  it("Should increase or decrease from + or - button press", async () => {
    const dummy = jest.fn();
    const addIng = { add: dummy, change: () => {}, delete: () => {} };
    render(<IngredientItem ingredient={Ing} IngReq={addIng} type="add" />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId(`${Ing.ingredient} button Add`));

    expect(
      screen.getByTestId(`${Ing.ingredient} button +`)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`${Ing.ingredient} changeamount`)
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByTestId(`${Ing.ingredient} changeamount`)
      ).getByDisplayValue("0")
    ).toHaveDisplayValue("0");

    await user.click(screen.getByTestId(`${Ing.ingredient} button +`));

    expect(
      screen.getByTestId(`${Ing.ingredient} changeamount`)
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByTestId(`${Ing.ingredient} changeamount`)
      ).getByDisplayValue("1")
    ).toHaveDisplayValue("1");

    await user.click(screen.getByTestId(`${Ing.ingredient} button -`));

    expect(
      screen.getByTestId(`${Ing.ingredient} changeamount`)
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByTestId(`${Ing.ingredient} changeamount`)
      ).getByDisplayValue("0")
    ).toHaveDisplayValue("0");
  });
  it("Should change select", async () => {
    const dummy = jest.fn();
    const addIng = { add: dummy, change: () => {}, delete: () => {} };
    render(<IngredientItem ingredient={Ing} IngReq={addIng} type="add" />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId(`${Ing.ingredient} button Add`));

    expect(screen.getByTestId(`${Ing.ingredient} select`)).toBeInTheDocument();

    await user.click(
      within(screen.getByTestId(`${Ing.ingredient} select`)).getByRole(
        "combobox"
      )
    );

    await user.click(
      screen.getByTestId(`${Ing.ingredient} option ${Ing.stdunits[1]}`)
    );

    expect(
      within(screen.getByTestId(`${Ing.ingredient} select`)).getByDisplayValue(
        Ing.stdunits[1]
      )
    ).toHaveValue(Ing.stdunits[1]);

    expect(
      within(screen.getByTestId(`${Ing.ingredient} select`)).getByDisplayValue(
        Ing.stdunits[1]
      )
    ).not.toHaveValue(Ing.stdunits[0]);
  });
  it("Should call addIngReq when clicking Add Ingredient", async () => {
    const dummy = jest.fn();
    const addIng = { add: dummy, change: () => {}, delete: () => {} };
    render(<IngredientItem ingredient={Ing} IngReq={addIng} type="add" />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId(`${Ing.ingredient} button Add`));

    await user.click(screen.getByTestId(`${Ing.ingredient} button +`));

    await user.click(
      within(screen.getByTestId(`${Ing.ingredient} select`)).getByRole(
        "combobox"
      )
    );

    await user.click(
      screen.getByTestId(`${Ing.ingredient} option ${Ing.stdunits[1]}`)
    );

    await user.click(
      screen.getByTestId(`${Ing.ingredient} button Add Ingredient`)
    );

    expect(dummy).toHaveBeenCalledTimes(1);
    expect(dummy).toHaveBeenCalledWith({
      ...Ing,
      amount: 1,
      unit: "Liter",
    });
  });
});
