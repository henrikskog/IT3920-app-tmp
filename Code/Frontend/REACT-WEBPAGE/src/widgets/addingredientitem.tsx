import React, { useState } from "react";
import { Ingredient, UnitIngredient } from "../types";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { PlussMinusButton } from "./amountbutton";

export function AddIngredientItem({
  ingredient,
  IngReq,
}: {
  ingredient: Ingredient;
  IngReq: {
    add: (IngReq: UnitIngredient) => void;
    change: (IngReq: UnitIngredient) => void;
    delete: (IngReq: UnitIngredient) => void;
  };
}) {
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState("");
  return adding ? (
    <>
      <Stack direction={"row"} spacing={1}>
        <TextField
          label="Amount"
          value={amount}
          sx={{ minWidth: 70, maxWidth: 120 }}
          onChange={(event) =>
            setAmount(
              !isNaN(Number(event.target.value))
                ? Number(event.target.value)
                : 0
            )
          }
          data-testid={`${ingredient.ingredient} changeamount`}
        />

        <FormControl required sx={{ minWidth: 120 }}>
          <InputLabel id="unit label">Unit</InputLabel>
          <Select
            data-testid={`${ingredient.ingredient} select`}
            labelId="unit select"
            id="unit select"
            value={unit}
            label="Unit *"
            onChange={(event) => setUnit(event.target.value)}
          >
            <MenuItem value="">
              <em>Choose a unit</em>
            </MenuItem>
            {ingredient.stdunits.map((u, i) => (
              <MenuItem
                key={i}
                data-testid={`${ingredient.ingredient} option ${u}`}
                value={u}
              >
                {u}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <PlussMinusButton
          amount={amount}
          ingredient={ingredient.ingredient}
          onClickPluss={() => setAmount((a) => a + 1)}
          onClickMinus={() => amount - 1 >= 0 && setAmount((a) => a - 1)}
        />
      </Stack>
      <Stack direction={"row"} spacing={2}>
        <Button
          disabled={unit == "" || amount == 0}
          color="success"
          variant="contained"
          style={{ marginRight: "10px" }}
          data-testid={`${ingredient.ingredient} button Add Ingredient`}
          onClick={() => {
            const request: UnitIngredient = {
              ...ingredient,
              amount: amount,
              unit: unit,
            };
            IngReq.add(request);
            setAdding(false);
            setUnit("");
            setAmount(0);
          }}
        >
          Confirm
        </Button>
        <Button
          color="error"
          variant="contained"
          data-testid={`${ingredient.ingredient} button Cancel`}
          onClick={() => {
            setAdding(false);
            setUnit("");
            setAmount(0);
          }}
        >
          Cancel
        </Button>
      </Stack>
    </>
  ) : (
    <Button
      variant="contained"
      data-testid={`${ingredient.ingredient} button Add`}
      onClick={() => setAdding(true)}
    >
      Add
    </Button>
  );
}
