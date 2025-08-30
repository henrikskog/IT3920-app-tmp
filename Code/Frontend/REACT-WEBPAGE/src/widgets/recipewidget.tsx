import React, { useEffect, useState } from "react";
import { DisplayRecipe } from "../types";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { FavoriteWidget } from "./favoritewidget";
import imageService from "../services/imageservice";
import { CardContent } from "@mui/material";

export function RecipeWidget({ recipe }: { recipe: DisplayRecipe }) {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    navigateTo: string
  ) => {
    // Needs typescript something
    if (event.key === "Enter" && event.target === event.currentTarget) {
      event.preventDefault(); // Prevent default behavior, like scrolling
      navigate(navigateTo);
    }
  };
  useEffect(() => {
    let url: string = "";
    imageService
      .get(recipe.image_id)
      .then((data) => {
        console.log(data);
        url = URL.createObjectURL(data);
        console.log(url);
        setImageSrc(url);
      })
      .catch((err) => console.error(err));
    return () => {
      console.log("REVOKED!");
      URL.revokeObjectURL(url);
    };
  }, [recipe.image_id]);
  console.log(recipe.image_id);
  return (
    <>
      <Card
        sx={{
          maxWidth: 300,
          height: 300,
          cursor: "pointer",
          marginRight: "15px",
          marginBottom: "10px",
        }}
        data-testid={`${recipe.id} card`}
        onClick={() => {
          navigate(`/recipes/${recipe.id}`);
        }}
        onKeyDown={(event) => handleKeyDown(event, `/recipes/${recipe.id}`)}
        tabIndex={0}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[700] }}
              aria-label="profile"
              data-testid={`${recipe.id} button profile`}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/profile");
              }}
            >
              {recipe.username.at(0)}
            </Avatar>
          }
          titleTypographyProps={{ variant: "h4" }}
          title={recipe.title}
          data-testid={`${recipe.id} card header`}
          subheader={new Date(recipe.date).toLocaleString()}
          action={<FavoriteWidget recipe={recipe} />}
        />
        <CardContent>{recipe.description}</CardContent>
        <CardMedia
          component="img"
          height="140"
          image={imageSrc}
          alt={recipe.title}
          data-testid={`${recipe.id} image`}
        />
      </Card>
    </>
  );
}
