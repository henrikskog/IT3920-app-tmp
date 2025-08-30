import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context";
import recipeService from "../../services/recipeservice";
import {
  FullRecipe,
  ImageFile,
  RecipeCreate,
  RecipeUpdate,
  UnitIngredient,
} from "../../types";
import { ingredientsReducer } from "../../reducers/ingredientReducer";
import { EditIngredient } from "../../widgets/editingredient";
import { RecipeStepWidget } from "../../widgets/recipestepwidget";
import { recipeStepsReducer } from "../../reducers/recipeStepReducer";
import imageService from "../../services/imageservice";
import { Button, TextField } from "@mui/material";

export const Component = EditRecipePage;

export function EditRecipePage() {
  const [recipe, setRecipe] = useState<FullRecipe>();
  const [image, setImage] = useState<Blob>();
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [altText, setAltText] = useState("");
  const [blob, setBlob] = useState<File | Blob | "">("");
  const [description, setDescription] = useState("");
  const { recipe_id } = useParams();
  const user = useContext(UserContext);

  const navigate = useNavigate();

  const [ingredientRequests, ingredientDispatch] = useReducer(
    ingredientsReducer,
    []
  );

  function addIngReq(IngReq: UnitIngredient) {
    ingredientDispatch({ type: "added", ingreq: IngReq });
  }

  function changeIngReq(IngReq: UnitIngredient) {
    ingredientDispatch({ type: "changed", ingreq: IngReq });
  }

  function deleteIngReq(IngReq: UnitIngredient) {
    ingredientDispatch({ type: "deleted", ingreq: IngReq });
  }

  const [recipeSteps, recipeDispatch] = useReducer(recipeStepsReducer, []);

  function addRecReq(RecReq: string) {
    recipeDispatch({ type: "added", recreq: RecReq });
  }

  function changeRecReq(RecReq: string, index: number) {
    recipeDispatch({ type: "changed", recreq: RecReq, index: index });
  }

  function deleteRecReq(index: number) {
    recipeDispatch({ type: "deleted", index: index });
  }

  console.log(user.name, blob, recipe_id, recipe);

  useEffect(() => {
    if (!user.name) {
      navigate("/login");
      return;
    }
    if (recipe_id)
      recipeService
        .get(Number(recipe_id))
        .then((data) => {
          setRecipe(data);
          setTitle(data.title);
          setDescription(data.description);
          imageService
            .get(data.image_id)
            .then((data) => {
              setImage(data);
              setBlob(data);
              setImageURL(URL.createObjectURL(data));
            })
            .catch((err) => console.error(err));
          data.recipe
            .sort((a, b) => a.step - b.step)
            .forEach((r) => addRecReq(r.instruction));
          data.ingredients.forEach((i) => addIngReq(i));
        })
        .catch((err) => console.log(err));
  }, [recipe_id]);

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
        {recipe_id ? (
          <h1 style={{ fontSize: "4em", textAlign: "center" }}>
            Edit your Recipe
          </h1>
        ) : (
          <h1 style={{ fontSize: "4em", textAlign: "center" }}>
            Create a recipe
          </h1>
        )}
        <div>
          {recipe_id ? (
            <Button
              variant="contained"
              color="success"
              data-testid={"recipe button save"}
              onClick={() => {
                console.log(new Blob([blob]), image);
                const updatedRecipe: RecipeUpdate = {};

                if (recipe?.title != title) {
                  updatedRecipe.title = title;
                }

                if (!Object.is(blob, image)) {
                  imageService
                    .update(Number(recipe_id), blob as ImageFile)
                    .then((id) => {
                      updatedRecipe.image_id = id;
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                }

                // Recipe ingredients update check
                if (
                  recipe?.ingredients.length != ingredientRequests.length ||
                  ingredientRequests.some(
                    (i) =>
                      !recipe?.ingredients.some(
                        (ing) => ing.ingredient == i.ingredient
                      )
                  ) ||
                  ingredientRequests.some((i) =>
                    recipe?.ingredients.some(
                      (ing) =>
                        ing.ingredient == i.ingredient &&
                        (ing.amount != i.amount || ing.unit != i.unit)
                    )
                  )
                ) {
                  updatedRecipe.ingredients = ingredientRequests.map((i) => ({
                    ingredient: i.ingredient,
                    amount: i.amount,
                    unit: i.unit,
                  }));
                }

                // Recipe steps update check
                if (
                  recipe?.recipe.length != recipeSteps.length ||
                  recipeSteps
                    .map((r, i) => ({
                      step: i,
                      instruction: r,
                    }))
                    .some((s) =>
                      recipe?.recipe.some(
                        (step) =>
                          step.step == s.step &&
                          step.instruction != s.instruction
                      )
                    )
                ) {
                  updatedRecipe.recipe = recipeSteps.map((r, i) => ({
                    step: i,
                    instruction: r,
                  }));
                }

                recipeService
                  .update(Number(recipe_id), updatedRecipe)
                  .then(() => navigate(`/recipes/${recipe_id}`))
                  .catch((err) => console.log(err));
              }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              data-testid={"recipe button create"}
              onClick={async () => {
                try {
                  const image_id = await imageService.create(blob as ImageFile);
                  const createdRecipe: RecipeCreate = {
                    title: title,
                    description: description,
                    image_id: image_id,
                    ingredients: ingredientRequests.map((i) => ({
                      ingredient: i.ingredient,
                      amount: i.amount,
                      unit: i.unit,
                    })),
                    recipe: recipeSteps.map((r, i) => ({
                      step: i,
                      instruction: r,
                    })),
                  };
                  const recipe_id = await recipeService.create(createdRecipe);
                  navigate(`/recipes/${recipe_id}`);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              Create Recipe
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            style={{ marginLeft: "10px" }}
            data-testid={"recipe button cancel"}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
        <div style={{ width: "75%" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <div>
                <div>
                  <h2>Upload a photo and alternative text here:</h2>
                  <TextField
                    placeholder="alt text"
                    label="alt text"
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                    data-testid={"recipe input alt text"}
                    value={altText}
                    onChange={(e) => setAltText(e.currentTarget.value)}
                  />
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.length == 1) {
                        URL.revokeObjectURL(imageURL);
                        const blob = e.target.files[0];
                        setBlob(blob);
                        setImageURL(URL.createObjectURL(blob));
                      }
                    }}
                    accept="image/*"
                    data-testid={"recipe input image"}
                  />
                </div>
                <img
                  data-testid={"recipe image"}
                  height={400}
                  width={300}
                  alt={altText}
                  src={imageURL}
                />
              </div>
              <div>
                <h2>Write your title here:</h2>
                <TextField
                  placeholder="title"
                  label="title"
                  data-testid={"recipe input title"}
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              </div>
              <div>
                <h2>Write your description here:</h2>
                <TextField
                  placeholder="description"
                  label="description"
                  data-testid={"recipe input description"}
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  multiline
                  rows={4}
                />
              </div>
              <div>
                <h2>Write the steps for your recipe here:</h2>
                <RecipeStepWidget
                  recipe={recipeSteps}
                  recReq={{
                    add: addRecReq,
                    changed: changeRecReq,
                    delete: deleteRecReq,
                  }}
                />
              </div>
            </div>
            <div style={{ marginLeft: "100px" }}>
              <EditIngredient
                ingredients={ingredientRequests}
                ingreq={{
                  add: addIngReq,
                  change: changeIngReq,
                  delete: deleteIngReq,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
