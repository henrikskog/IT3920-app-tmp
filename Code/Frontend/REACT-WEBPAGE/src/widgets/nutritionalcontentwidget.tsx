import React from "react";
import { Ingredient } from "../types";

export function NutritionalContentWidget({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  return (
    <>
      <h1>Nutritional Content:</h1>
      <label>KCal per 100 gram:</label>
      <p>{ingredients.map((i) => i.kcal100gr).reduce((a, b) => a + b)}</p>
    </>
  );
}
