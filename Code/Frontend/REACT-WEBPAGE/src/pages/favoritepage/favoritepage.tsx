import React, { useContext, useEffect, useState } from "react";
import { RecipeWidget } from "../../widgets/recipewidget";
import favoriteService from "../../services/favoriteservice";
import { DisplayRecipe } from "../../types";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context";

export const Component = FavoritePage;

export function FavoritePage() {
  const [recipes, setRecipes] = useState<DisplayRecipe[]>([]);

  const user = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user.name) {
      navigate("/login");
      return;
    }
    favoriteService
      .getAll()
      .then((data) => {
        setRecipes(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
        <h1
          style={{
            textAlign: "center",
            fontSize: "4em",
            padding: "20px"
          }}
        >
          FAVORITES
        </h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {recipes.map((recipe, i) => (
          <RecipeWidget key={i} recipe={recipe} />
        ))}
      </div>
    </>
  );
}
