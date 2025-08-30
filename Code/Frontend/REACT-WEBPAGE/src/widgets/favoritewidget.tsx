import React, { useContext, useState, useEffect } from "react";
import favoriteService from "../services/favoriteservice";
import { DisplayRecipe } from "../types";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { UserContext } from "../context";

export function FavoriteWidget({ recipe }: { recipe: DisplayRecipe }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const user = useContext(UserContext);

  useEffect(() => {
    favoriteService
      .isFavorite(recipe.id)
      .then((data) => setIsFavorite(data != ""))
      .catch((error) => {
        setIsFavorite(false);
        console.error(`Error checking favorite status: `, error);
      });
  }, [recipe.id, user.name]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!user.name) {
      console.error("not logged in");
      return;
    }
    console.log(isFavorite);

    try {
      if (isFavorite) {
        await favoriteService.delete(recipe.id);
      } else {
        await favoriteService.create(user.name, recipe.id);
      }
      setIsFavorite((favorite) => !favorite);
    } catch (error) {
      console.error(`error toggling favorite: ${recipe.id}`, error);
    }
  };

  return (
    <IconButton onClick={toggleFavorite} aria-label="Add to favourite">
      <FavoriteIcon
        color={isFavorite ? "error" : "disabled"}
        sx={{ fontSize: 50 }}
      />
    </IconButton>
  );
}
