import React, { useEffect, useState } from "react";
import { Ingredient, UnitIngredient } from "../types";
import { IngredientItem } from "./ingredientitem";
import ingredientService from "../services/ingredientservice";
import Divider from "@mui/material/Divider";
import { Grid, Stack } from "@mui/material";
export function EditIngredient({
  ingredients,
  ingreq,
}: {
  ingredients: UnitIngredient[];
  ingreq: {
    add: (IngReq: UnitIngredient) => void;
    change: (IngReq: UnitIngredient) => void;
    delete: (IngReq: UnitIngredient) => void;
  };
}) {
  const [newIngredients, setNewIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    ingredientService
      .getAll()
      .then((data) => {
        const difference = data.filter(
          (i) => !ingredients.some((ing) => ing.ingredient == i.ingredient)
        );
        setNewIngredients(difference);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ingredients]);
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Grid container>
          <div style={{ marginRight: "75px" }}>
            <h1 data-testid={`Your Ingredients`}>Your Ingredients</h1>
            <Divider />
            <Stack divider={<Divider />} spacing={2}>
              {ingredients.map((item, i) => {
                return (
                  <IngredientItem
                    key={i}
                    ingredient={item}
                    IngReq={ingreq}
                    type="change"
                  />
                );
              })}
            </Stack>
          </div>
          <div>
            <h1 data-testid={`Add New Ingredients`}>Add New Ingredients</h1>
            <Divider />
            <Stack divider={<Divider />} spacing={2}>
              {newIngredients.map((item, i) => {
                return (
                  <IngredientItem
                    key={i}
                    ingredient={item}
                    IngReq={ingreq}
                    type="add"
                  />
                );
              })}
            </Stack>
          </div>
        </Grid>
      </div>
    </>
  );
}
