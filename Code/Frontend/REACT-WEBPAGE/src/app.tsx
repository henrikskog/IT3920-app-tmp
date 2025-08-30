import React from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  //useNavigate,
} from "react-router-dom";

import "./global.css";
/* import { Root } from "./pages/root/root";
import { HomePage } from "./pages/homepage/homepage";
import { LoginPage } from "./pages/loginpage/loginpage";
import { FridgePage } from "./pages/fridgepage/fridgepage";
import { FavoritePage } from "./pages/favoritepage/favoritepage";
import { RecipePage } from "./pages/recipepage/recipepage";
import { CalorietrackerPage } from "./pages/calorietrackerpage/calorietrackerpage";
import { RecipeListPage } from "./pages/recipelistpage/recipelistpage";
import { ProfilePage } from "./pages/profilepage/profilepage";
import { UserPage } from "./pages/userpage/userpage";
import { EditRecipePage } from "./pages/editrecipepage/editrecipepage";
import { CreateUserPage } from "./pages/createuserpage/createuserpage";
import { ShoppingListPage } from "./pages/shoppinglistpage/shoppinglistpage"; */

/* 
    More info on routing:
    https://reactrouter.com/en/main 
  */

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" lazy={() => import("./pages/root/root")}>
      <Route path="" lazy={() => import("./pages/homepage/homepage")} />
      <Route path="login" lazy={() => import("./pages/loginpage/loginpage")} />
      <Route
        path="profile"
        lazy={() => import("./pages/profilepage/profilepage")}
      />
      <Route
        path="createuser"
        lazy={() => import("./pages/createuserpage/createuserpage")}
      />
      <Route path="users">
        <Route
          path=":username"
          lazy={() => import("./pages/userpage/userpage")}
        />
      </Route>
      <Route
        path="fridge"
        lazy={() => import("./pages/fridgepage/fridgepage")}
      />
      <Route
        path="shoppinglist"
        lazy={() => import("./pages/shoppinglistpage/shoppinglistpage")}
      />
      <Route
        path="favorites"
        lazy={() => import("./pages/favoritepage/favoritepage")}
      />
      <Route path="recipes">
        <Route
          path=""
          lazy={() => import("./pages/recipelistpage/recipelistpage")}
        />
        <Route
          path="create"
          lazy={() => import("./pages/editrecipepage/editrecipepage")}
        />
        <Route
          path=":recipe_id"
          lazy={() => import("./pages/recipepage/recipepage")}
        />
        <Route
          path=":recipe_id/edit"
          lazy={() => import("./pages/editrecipepage/editrecipepage")}
        />
      </Route>
      <Route
        path="calorietracker"
        lazy={() => import("./pages/calorietrackerpage/calorietrackerpage")}
      />
    </Route>
  )
);

/* const router = createBrowserRouter(
  
  createRoutesFromElements(
    <Route path="/" Component={Root}>
      <Route path="" Component={HomePage} />
      <Route path="login" Component={LoginPage} />
      <Route path="profile" Component={ProfilePage} />
      <Route path="createuser" Component={CreateUserPage} />
      <Route path="users">
        <Route path=":username" Component={UserPage} />
      </Route>
      <Route path="fridge" Component={FridgePage} />
      <Route path="shoppinglist" Component={ShoppingListPage} />
      <Route path="favorites" Component={FavoritePage} />
      <Route path="recipes">
        <Route path="" Component={RecipeListPage} />
        <Route path="create" Component={EditRecipePage} />
        <Route path=":recipe_id" Component={RecipePage} />
        <Route path=":recipe_id/edit" Component={EditRecipePage} />
      </Route>
      <Route path="calorietracker" Component={CalorietrackerPage} />
    </Route>
  )
); */

export function App() {
  return <RouterProvider router={router} />;
}
