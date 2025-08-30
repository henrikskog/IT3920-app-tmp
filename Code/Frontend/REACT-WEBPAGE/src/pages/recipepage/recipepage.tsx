import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import recipeService from "../../services/recipeservice";
import { FullRecipe } from "../../types";
import { UserContext } from "../../context";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { red } from "@mui/material/colors";
import shoppinglistService from "../../services/shoppinglistService";
import imageService from "../../services/imageservice";
import { FavoriteWidget } from "../../widgets/favoritewidget";
import { RatingWidget } from "../../widgets/ratingwidget";
import { Divider, Grid, Typography } from "@mui/material";
//import { FavoriteWidget } from "../../widgets/favoritewidget";
//import { RatingWidget } from "../../widgets/ratingwidget";

export const Component = RecipePage;

export function RecipePage() {
  const [recipe, setRecipe] = useState<FullRecipe>();
  const [imageSrc, setImageSrc] = useState("");
  const { recipe_id } = useParams();
  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    recipeService
      .get(Number(recipe_id))
      .then((data) => {
        setRecipe(data);
      })
      .catch((err) => console.log(err));
  }, [recipe_id]);

  useEffect(() => {
    let url: string = "";
    if (recipe?.image_id)
      imageService
        .get(recipe.image_id)
        .then((data) => {
          console.log(data);
          url = URL.createObjectURL(data);
          setImageSrc(url);
        })
        .catch((err) => console.error(err));
    return () => {
      console.log("REVOKED!");
      URL.revokeObjectURL(url);
    };
  }, [recipe?.image_id]);

  if (!recipe)
    return (
      <>
        <h1>Something went wrong</h1>
      </>
    );
  console.log(imageSrc);
  console.log(recipe.userrating);
  return (
    <>
      {/* Put rating and favorite widgets in when done */}
      {/* Rating Widget not done yet */}
      {/* <RatingWidget id={Number(recipe_id)} /> */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ width: "50%" }}>
          <img
            alt="recipe image"
            data-testid={"recipe-image"}
            src={imageSrc}
            style={{
              maxWidth: "100%",
              objectFit: "cover",
              borderRadius: "25px",
            }}
          />
          <Grid justifyContent="center" container spacing={1}>
            <Grid item xs={"auto"}>
              <Typography variant="h2">{recipe.title}</Typography>
            </Grid>
            <Grid item xs>
              <FavoriteWidget recipe={recipe} />
            </Grid>
            {/* rating widget her mellom bildet og add to shoppinglistknappen */}
            <Grid item xs={12}>
              <Typography variant="body1">{recipe.description}</Typography>
            </Grid>
            {recipe.username == user.name && (
              <Grid item xs={"auto"}>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/recipes/${recipe_id}/edit`)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </Button>
              </Grid>
            )}

            <Grid item xs>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  shoppinglistService
                    .create(user.name, recipe.id)
                    .then(() => {
                      navigate("/shoppinglist");
                    })
                    .catch(() => {});
                }}
              >
                Add to shopping list
              </Button>
            </Grid>

            <Grid item xs={12}>
              <RatingWidget recipe_id={recipe.id} />
            </Grid>
          </Grid>

          <Divider />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "10px",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ bgcolor: red[700], cursor: "pointer", marginRight: "10px" }}
              aria-label="profile"
              onClick={() => {
                navigate("/profile");
              }}
            >
              {recipe.username.at(0)}
            </Avatar>
            <p>{recipe.username}</p>
          </div>
          <Divider />
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((i, index) => (
              <li
                key={index}
                title={`${i.ingredient}`}
              >{`${i.amount} ${i.unit} ${i.ingredient}`}</li>
            ))}
          </ul>

          <h2>Steps</h2>
          <ol>
            {recipe.recipe
              .sort((a, b) => a.step - b.step)
              .map((s, index) => (
                <li key={index} title={`Step ${s.step}`}>
                  {s.instruction}
                </li>
              ))}
          </ol>
          <p style={{ marginTop: "50px" }}>
            <span style={{ fontWeight: "bold" }}>Published:</span>{" "}
            {new Date(recipe.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}
