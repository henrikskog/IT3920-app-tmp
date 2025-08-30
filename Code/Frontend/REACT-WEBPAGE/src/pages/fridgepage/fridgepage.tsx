import React, { useContext, useEffect, useReducer, useState } from "react";
import { SimpleUnitIngredient, UnitIngredient } from "../../types";
import { IngredientItem } from "../../widgets/ingredientitem";
import fridgeService from "../../services/fridgeservice";
import { UserContext } from "../../context";
import { EditIngredient } from "../../widgets/editingredient";
import { ingredientsReducer } from "../../reducers/ingredientReducer";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export const Component = FridgePage;

export function FridgePage() {
  const [ingredients, setIngredients] = useState<UnitIngredient[]>([]);
  const [edit, setEdit] = useState(false);

  const [ingredientRequests, dispatch] = useReducer(
    ingredientsReducer,
    ingredients
  );

  const user = useContext(UserContext);

  const navigate = useNavigate();

  function addIngReq(IngReq: UnitIngredient) {
    dispatch({ type: "added", ingreq: IngReq });
  }

  function changeIngReq(IngReq: UnitIngredient) {
    dispatch({ type: "changed", ingreq: IngReq });
  }

  function deleteIngReq(IngReq: UnitIngredient) {
    dispatch({ type: "deleted", ingreq: IngReq });
  }

  function resetIngReq() {
    dispatch({ type: "reset" });
  }

  useEffect(() => {
    // Found no good methods of implementing try catch
    // Use then catch for useEffect
    if (!user.name) {
      navigate("/login");
      return;
    }
    fridgeService
      .get(user.name)
      .then((data) => {
        data.forEach((ingredient) => {
          addIngReq(ingredient);
        });
        setIngredients(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user.name]);

  function saveButton() {
    const newIngs: SimpleUnitIngredient[] = ingredientRequests
      .filter((i) => !ingredients.some((ing) => ing.ingredient == i.ingredient))
      .map(({ ingredient, amount, unit }) => ({
        ingredient: ingredient,
        amount: amount,
        unit: unit,
      }));

    const changedIngs: SimpleUnitIngredient[] = ingredientRequests
      .filter((i) =>
        ingredients.some(
          (ing) => ing.ingredient == i.ingredient && ing.amount != i.amount
        )
      )
      .map(({ ingredient, amount, unit }) => ({
        ingredient: ingredient,
        amount: amount,
        unit: unit,
      }));

    const removedIngs: SimpleUnitIngredient[] = ingredients
      .filter(
        (i) => !ingredientRequests.some((ing) => i.ingredient == ing.ingredient)
      )
      .map(({ ingredient, amount, unit }) => ({
        ingredient: ingredient,
        amount: amount,
        unit: unit,
      }));

    if (newIngs.length)
      fridgeService.add(user.name, newIngs).catch((err) => console.log(err));
    if (changedIngs.length)
      fridgeService
        .update(user.name, changedIngs)
        .catch((err) => console.log(err));
    if (removedIngs.length)
      removedIngs.forEach((i) =>
        fridgeService.remove(user.name, i).catch((err) => console.log(err))
      );

    setIngredients(ingredientRequests);
  }

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
        <h1 style={{ fontSize: "4em", textAlign: "center"}}>Your Fridge</h1>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <div>
            {edit && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  style={{ marginRight: "10px" }}
                  data-testid={`fridge button Confirm`}
                  onClick={() => {
                    saveButton();
                    setEdit(false);
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  data-testid={`fridge button Cancel`}
                  onClick={() => {
                    console.log("No Changes done");
                    resetIngReq();
                    ingredients.forEach((i) => addIngReq(i));
                    setEdit(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
        <div style={{ width: "25%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
            {/* <img alt="nothing"></img> */}
            <div>
              {edit ? (
                <EditIngredient
                  ingredients={ingredientRequests}
                  ingreq={{
                    add: addIngReq,
                    change: changeIngReq,
                    delete: deleteIngReq,
                  }}
                />
              ) : (
                <>
                  <h1>Your Ingredients</h1>
                  {ingredients.map((item, i) => {
                    return (
                      <IngredientItem key={i} ingredient={item} type="display" />
                    );
                  })}
                </>
              )}
            </div>
            <div>
              {!edit && (
                <Button
                  color="primary"
                  variant="contained"
                  style={{ marginTop: "15px", justifySelf: "left" }}
                  data-testid={`fridge button Add/Remove Ingredient`}
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Add/Remove Ingredient
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
