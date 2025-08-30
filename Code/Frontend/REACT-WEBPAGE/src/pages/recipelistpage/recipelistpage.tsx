import React, { useEffect, useState } from "react";
import recipeService from "../../services/recipeservice";
import { DisplayRecipe } from "../../types";
import { RecipeWidget } from "../../widgets/recipewidget";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export const Component = RecipeListPage

export function RecipeListPage() {
  const [recipes, setRecipes] = useState<DisplayRecipe[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    recipeService
      .getAll()
      .then((data) => {
        setRecipes(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1 style={{ fontSize: '4em'}}>Recipes</h1>
      <Button
        variant="contained"
        data-testid={`recipe list button create`}
        onClick={() => navigate("/recipes/create")}
      >
        Create a new Recipe!
      </Button>
      {/* Put Filter here */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "25px" }}>
        {recipes.map((recipe, i) => (
          <RecipeWidget key={i} recipe={recipe} />
        ))}
      </div>
    </>
  );
}
