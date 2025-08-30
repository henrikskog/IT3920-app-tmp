import express from "express";
import { recipeRouter } from "./routes/recipeRouter.js";
import { shoppingListRouter } from "./routes/shoppinglistRouter.js";
import { ingredientRouter } from "./routes/ingredientRouter.js";
import { fridgeRouter } from "./routes/fridgeRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { favoriteRouter } from "./routes/favoriteRouter.js";
import { imageRouter } from "./routes/imageRouter.js";
import { loginRouter } from "./routes/loginRouter.js";
import { ratingRouter } from "./routes/ratingRouter.js";

const apiRouter = express.Router();

/* 
    Example route:
    apiRouter.use("/questions", questionsRouter);
*/

/*  
    If params are written here, example: /fridges/:username 
    It will give errors for the router 
*/

apiRouter.use("/fridges", fridgeRouter);
apiRouter.use("/recipes", recipeRouter);
apiRouter.use("/shoppinglist", shoppingListRouter);
apiRouter.use("/ingredients", ingredientRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/favorites", favoriteRouter);
apiRouter.use("/images", imageRouter);
apiRouter.use("/logins", loginRouter);
apiRouter.use("/ratings", ratingRouter);

export default apiRouter;
