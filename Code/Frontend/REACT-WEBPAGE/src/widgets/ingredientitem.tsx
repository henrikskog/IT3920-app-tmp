import React from "react";
import { Ingredient, UnitIngredient } from "../types";
import { AddIngredientItem } from "./addingredientitem";
import { ChangeIngredientItem } from "./changeingredientitem";
import { Card, CardContent, Typography } from "@mui/material";
export function IngredientItem({
  ingredient,
  IngReq,
  type,
}:
  | {
      ingredient: Ingredient;
      IngReq: {
        add: (IngReq: UnitIngredient) => void;
        change: (IngReq: UnitIngredient) => void;
        delete: (IngReq: UnitIngredient) => void;
      };
      type: "add";
    }
  | {
      ingredient: UnitIngredient;
      IngReq: {
        add: (IngReq: UnitIngredient) => void;
        change: (IngReq: UnitIngredient) => void;
        delete: (IngReq: UnitIngredient) => void;
      };
      type: "change";
    }
  | {
      ingredient: UnitIngredient | Ingredient;
      IngReq?: {
        add: (IngReq: UnitIngredient) => void;
        change: (IngReq: UnitIngredient) => void;
        delete: (IngReq: UnitIngredient) => void;
      };
      type: "display";
    }) {
  return (
    <>
      <Card variant="outlined" sx={{ minHeight: 60, maxHeight: 140 }}>
        <Typography
          variant={"h4"}
          data-testid={`${ingredient.ingredient} ingredient`}
        >
          {ingredient.ingredient}
        </Typography>
        {Object.keys(ingredient).includes("amount") &&
          Object.keys(ingredient).includes("unit") && (
            <CardContent>
              <Typography data-testid={`${ingredient.ingredient} amount`}>
                Amount: {(ingredient as UnitIngredient).amount}
              </Typography>
              <Typography data-testid={`${ingredient.ingredient} unit`}>
                Unit: {(ingredient as UnitIngredient).unit}
              </Typography>
            </CardContent>
          )}
      </Card>
      {type == "change" && (
        <ChangeIngredientItem ingredient={ingredient} IngReq={IngReq} />
      )}
      {type == "add" && (
        <AddIngredientItem ingredient={ingredient} IngReq={IngReq} />
      )}
    </>
  );
}
