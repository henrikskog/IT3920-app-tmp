import React, { useContext, useEffect, useReducer } from "react";
import shoppinglistService from "../../services/shoppinglistService";
import {
  Shopping_list /* , Shopping_list_item */,
  Shopping_list_item,
  SimpleUnitIngredient,
} from "../../types";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { UserContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { shoppingListReducer } from "../../reducers/shoppingListReducer";
import { loginService } from "../../services/loginService";
import { Grid, Stack, Typography } from "@mui/material";

export const Component = ShoppingListPage;

export function ShoppingListPage() {
  const [shoppingList, dispatch] = useReducer(shoppingListReducer, []);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  function addShoppingList(shopping_list_item: Shopping_list_item) {
    dispatch({ type: "added", item: shopping_list_item });
  }

  function changeShoppingList(
    shopping_list_id: number,
    shopping_list_item: Shopping_list_item
  ) {
    dispatch({
      type: "changed",
      id: shopping_list_id,
      replacemment: shopping_list_item,
    });
  }

  console.log(addShoppingList, changeShoppingList);

  function resetShoppingList() {
    dispatch({ type: "reset" });
  }

  function deleteShoppingList(shopping_list_id: number) {
    dispatch({ type: "deleted", id: shopping_list_id });
  }

  function setShoppingList(shopping_list: Shopping_list) {
    dispatch({ type: "set", shopping_list: shopping_list });
  }

  useEffect(() => {
    if (!loginService.isLoggedIn()) {
      navigate("/login");
      return;
    }
    shoppinglistService
      .get()
      .then((data) => {
        console.log(data);
        setShoppingList(data);
      })
      .catch((err) => console.error(err));
  }, [user.name]);
  console.log(shoppingList);

  if (!shoppingList) {
    return <div>Loading...</div>;
  }

  if (shoppingList.length == 0) {
    return (
      <>
        <Typography variant="h1">Shopping Listen din er tom!</Typography>
        <Typography variant="body1">
          Legg til en oppskrift i Handlelisten din for å se den her!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/recipes")}
        >
          Recipes
        </Button>
      </>
    );
  }

  console.log(shoppingList);

  return (
    <Grid container justifyContent={"center"} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h1">Shopping List</Typography>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            shoppinglistService
              .buyAll(user.name, shoppingList)
              .catch((err) => console.error(err));

            resetShoppingList();
          }}
        >
          bought all and add to fridge
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            shoppinglistService
              .removeAll(shoppingList)
              .then(() => {
                resetShoppingList();
              })
              .catch((err) => console.error(err));
          }}
        >
          Delete all
        </Button>
      </Grid>

      <Grid container item xs={6} justifyContent={"center"} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Recipes</Typography>
        </Grid>

        {shoppingList.map((s, i) => (
          <Grid item xs={12} key={i}>
            <Stack direction={"row"} spacing={1}>
              <Typography variant="body1">{s.recipe.title}</Typography>

              <Button
                sx={{
                  minWidth: 10,
                  minHeight: 10,
                  maxWidth: 25,
                  maxHeight: 25,
                }}
                color="success"
                variant="contained"
                onClick={() => {
                  shoppinglistService.buy(user.name, s);
                  deleteShoppingList(s.id);
                }}
              >
                ✓
              </Button>
              <Button
                sx={{
                  minWidth: 10,
                  minHeight: 10,
                  maxWidth: 25,
                  maxHeight: 25,
                }}
                color="error"
                variant="contained"
                onClick={() => {
                  shoppinglistService
                    .remove(s.id)
                    .catch((err) => console.error(err));
                  deleteShoppingList(s.id);
                }}
              >
                X
              </Button>
            </Stack>
          </Grid>
        ))}
      </Grid>
      <Grid container item xs={6} justifyContent={"center"} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2">Ingredients</Typography>
        </Grid>
        <Grid item xs={12}>
          {shoppingList
            .map((s) => s.ingredients)
            .reduce(
              (a, b) => [
                ...b.filter(
                  (i) => !a.some((ing) => ing.ingredient == i.ingredient)
                ),
                ...a
                  .filter((i) =>
                    b.some((ing) => ing.ingredient == i.ingredient)
                  )
                  .map((i) => ({
                    ...i,
                    amount:
                      i.amount +
                      (
                        b.find(
                          (ing) => i.ingredient == ing.ingredient
                        ) as SimpleUnitIngredient
                      ).amount,
                  })),
                ...a.filter(
                  (i) => !b.some((ing) => ing.ingredient == i.ingredient)
                ),
              ],
              []
            )
            .map((i, index) => (
              <Typography key={index}>
                <Checkbox aria-label="checkbox" />{" "}
                {`${i.amount} ${i.unit} ${i.ingredient}`}
              </Typography>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
