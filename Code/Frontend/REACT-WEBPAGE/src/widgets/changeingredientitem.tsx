import React from "react";
import { UnitIngredient } from "../types";
import { PlussMinusButton } from "./amountbutton";
import { Button, Stack } from "@mui/material";

export function ChangeIngredientItem({
  ingredient,
  IngReq,
}: {
  ingredient: UnitIngredient;
  IngReq: {
    add: (IngReq: UnitIngredient) => void;
    change: (IngReq: UnitIngredient) => void;
    delete: (IngReq: UnitIngredient) => void;
  };
}) {
  return (
    <Stack direction="row">
      <PlussMinusButton
        amount={ingredient.amount}
        ingredient={ingredient.ingredient}
        onClickPluss={() => {
          if (ingredient.amount !== undefined) {
            const request: UnitIngredient = {
              ...ingredient,
              amount: ingredient.amount + 1,
            };
            IngReq.change(request);
          }
        }}
        onClickMinus={() => {
          if (ingredient.amount !== undefined && ingredient.amount > 1) {
            const request: UnitIngredient = {
              ...ingredient,
              amount: ingredient.amount - 1,
            };
            IngReq.change(request);
          }
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          style={{ marginLeft: "10px" }}
          variant="contained"
          color="error"
          onClick={() => IngReq.delete(ingredient)}
        >
          Remove
        </Button>
      </div>
    </Stack>
  );
}
