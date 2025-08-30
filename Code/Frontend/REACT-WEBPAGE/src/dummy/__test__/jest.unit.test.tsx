import React from "react";
import { Test } from "../dummy";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

describe("Jest tests", () => {
  it("Should match snapshot of test UI", () => {
    const component = renderer.create(<Test />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // "Should match snapshot of test UI with input"
    

  // Enzyme does not or will support React 18. Use RTL instead
  // https://stackoverflow.com/questions/72029189/does-enzyme-support-react-version-18
  // Migrate help: https://testing-library.com/docs/react-testing-library/migrate-from-enzyme#using-act-and-wrapperupdate 
  it("Should match input", () => {
    const value = 5;
    render(<Test input={value} />);

    expect(screen.getByRole("heading").innerHTML).toBe(`Hello World! ${value}`);
  });

  it("Should match input after interaction", async () => {
    const value = 3;
    render(<Test input={value} />);

    const user = userEvent.setup()

    await user.click(screen.getByRole("button"))

    expect(screen.getByRole("heading").innerHTML).toBe(`Hello World! ${value - 1}`);
  });
});
