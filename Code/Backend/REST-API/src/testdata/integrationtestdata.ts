import "dotenv/config";
import {
  DisplayRecipe,
  Favorite,
  FullRecipe,
  Image,
  Ingredient,
  RatingCreate,
  Shopping_list,
  UnitIngredient,
  UserCreate,
} from "../types.js";
import fs from "fs";
import axios from "axios";
import pool from "../mysql-pool.js";
import { loginService } from "../services/loginservice.js";
import { restartFunc, startUpFunc } from "../sqlCommands.js";

const foodNames = [
  "beef.jpg",
  "lamb-stew.jpg",
  "lollipopp.jpg",
  "omelett.jpg",
  "raspeballe.jpg",
  "brownie.jpg",
  "sodd.jpg",
  "spaghetti.jpg",
  "taco.jpg",
  "cake.jpg",
];

const userNames = [
  "agnes.jpg",
  "amanda.jpg",
  "arne.jpg",
  "bjarne.jpg",
  "rolf.jpg",
];

const rawimages = foodNames
  .map((n) => fs.readFileSync(`./src/testdata/images/foodimages/${n}`))
  .concat(
    userNames.map((n) =>
      fs.readFileSync(`./src/testdata/images/userimages/${n}`)
    )
  );

const images: Image[] = rawimages.map((r) => ({ image: r, type: "image/jpg" }));

const users: UserCreate[] = [
  { name: "Agnes", password: "12345", image_id: foodNames.length + 1 },
  { name: "Amanda", password: "12345", image_id: foodNames.length + 2 },
  { name: "Arne", password: "12345", image_id: foodNames.length + 3 },
  { name: "Bjarne", password: "12345", image_id: foodNames.length + 4 },
  { name: "Rolf", password: "12345", image_id: foodNames.length + 5 },
];

const ingredients: Ingredient[] = [
  /* 0 */ {
    ingredient: "Cattle",
    stdunits: ["Kilogram", "Gram"],
    kcalper100gram: 250,
  },
  /* 1 */ {
    ingredient: "Cale",
    stdunits: ["Unit", "Kilogram", "Gram"],
    kcalper100gram: 10,
  },
  /* 2 */ {
    ingredient: "Sheep",
    stdunits: ["Kilogram", "Gram"],
    kcalper100gram: 200,
  },
  /* 3 */ {
    ingredient: "Potato",
    stdunits: ["Unit", "Kilogram", "Gram"],
    kcalper100gram: 50,
  },
  /* 4 */ {
    ingredient: "Pepper",
    stdunits: ["tsp", "tbsp"],
    kcalper100gram: 0,
  },
  /* 5 */ { ingredient: "Salt", stdunits: ["tsp", "tbsp"], kcalper100gram: 0 },
  /* 6 */ {
    ingredient: "Sugar",
    stdunits: ["tsp", "tbsp", "Liter", "Kilogram", "Gram"],
    kcalper100gram: 100,
  },
  /* 7 */ {
    ingredient: "Chocolate",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 250,
  },
  /* 8 */ {
    ingredient: "Egg",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 80,
  },
  /* 9 */ {
    ingredient: "Tomato",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 40,
  },
  /* 10 */ {
    ingredient: "Spring onions",
    stdunits: ["Unit"],
    kcalper100gram: 80,
  },
  /* 11 */ {
    ingredient: "Cheese",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 140,
  },
  /* 12 */ {
    ingredient: "Shallots",
    stdunits: ["Unit"],
    kcalper100gram: 30,
  },
  /* 13 */ {
    ingredient: "Red onion",
    stdunits: ["Unit"],
    kcalper100gram: 40,
  },
  /* 14 */ {
    ingredient: "Flour",
    stdunits: ["Liter", "Kilogram", "Gram", "tbsp"],
    kcalper100gram: 70,
  },
  /* 15 */ {
    ingredient: "Sausage",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 300,
  },
  /* 16 */ {
    ingredient: "Carrot",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 55,
  },
  /* 17 */ {
    ingredient: "Citric acid",
    stdunits: ["Liter", "tbsp", "tsp"],
    kcalper100gram: 55,
  },
  /* 18 */ {
    ingredient: "Cocoa",
    stdunits: ["Liter", "Kilogram", "Gram", "tbsp", "tsp"],
    kcalper100gram: 20,
  },
  /* 19 */ {
    ingredient: "Tutti frutti",
    stdunits: ["Kilogram", "Gram"],
    kcalper100gram: 30,
  },
  /* 20 */ {
    ingredient: "Butter",
    stdunits: ["Kilogram", "Gram"],
    kcalper100gram: 200,
  },
  /* 21 */ {
    ingredient: "Baking soda",
    stdunits: ["tbsp", "tsp"],
    kcalper100gram: 5,
  },
  /* 22 */ {
    ingredient: "Sodd ball",
    stdunits: ["Kilogram", "Gram"],
    kcalper100gram: 90,
  },
  /* 23 */ {
    ingredient: "Broth",
    stdunits: ["Unit"],
    kcalper100gram: 20,
  },
  /* 24 */ {
    ingredient: "Spaghetti",
    stdunits: ["Kilogram", "Gram"],
    kcalper100gram: 80,
  },
  /* 25 */ {
    ingredient: "Minced meat",
    stdunits: ["Kilogram", "Gram"],
    kcalper100gram: 150,
  },
  /* 26 */ {
    ingredient: "Parmesan",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 170,
  },
  /* 27 */ {
    ingredient: "Cheddar",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 180,
  },
  /* 28 */ {
    ingredient: "Taco shell",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 75,
  },
  /* 29 */ {
    ingredient: "Chili",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 30,
  },
  /* 30 */ {
    ingredient: "Bell pepper",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 25,
  },
  /* 31 */ {
    ingredient: "Cucumber",
    stdunits: ["Kilogram", "Gram", "Unit"],
    kcalper100gram: 2,
  },
];

const recipes: FullRecipe[] = [
  {
    id: 1,
    image_id: 1,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[0].name,
    title: "Beef",
    description: "Good tenderloin fried medium rare",
    recipe: [
      { step: 1, instruction: "Preheat the oven 220 °C" },
      { step: 2, instruction: "Fry the beef in a pan" },
      {
        step: 3,
        instruction:
          "Then put the beef with a thermometer inside the oven until the core temperature is 70 °C",
      },
      {
        step: 4,
        instruction:
          "Take the beef out of the oven and cut it into smaller portions",
      },
      {
        step: 5,
        instruction: "Enjoy!",
      },
    ],
    ingredients: [
      { ...ingredients[0], amount: 500, unit: "Gram" },
      { ...ingredients[10], amount: 4, unit: "Unit" },
    ],
  },
  {
    id: 2,
    image_id: 2,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[0].name,
    title: "Fårikål",
    description: "Traditional food from Norway",
    recipe: [
      { step: 1, instruction: "Cut the cale into big slices" },
      {
        step: 2,
        instruction: "Put every second layer with cale and sheep and pepper",
      },
      {
        step: 3,
        instruction: "Let it cook for 3 hours",
      },
      {
        step: 4,
        instruction: "Serve directly from the pot",
      },
    ],
    ingredients: [
      { ...ingredients[1], amount: 7, unit: "Unit" },
      { ...ingredients[2], amount: 2, unit: "Kilogram" },
      { ...ingredients[3], amount: 14, unit: "Unit" },
    ],
  },
  {
    id: 3,
    image_id: 3,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[0].name,
    title: "Lollipop",
    description: "Tasty classic for a hot summer",
    recipe: [
      {
        step: 1,
        instruction:
          "Smelt the chocolate and butter some molds with the chocolate",
      },
      {
        step: 2,
        instruction:
          "Mix the water with the sugar, then pour it into the molds with the chocolate in",
      },
      {
        step: 3,
        instruction: "Put popsicle sticks in for grip",
      },
      {
        step: 4,
        instruction: "Freeze it for a day",
      },
      {
        step: 5,
        instruction: "Enjoy with great pleasure the day after!",
      },
    ],
    ingredients: [
      { ...ingredients[6], amount: 20, unit: "tbsp" },
      { ...ingredients[7], amount: 1, unit: "Kilogram" },
    ],
  },
  {
    id: 4,
    image_id: 4,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[1].name,
    title: "Omelette",
    description: "Tasty omelette from Spain",
    recipe: [
      {
        step: 1,
        instruction:
          "Chop up the vegetables and mix them together in hot butter",
      },
      {
        step: 2,
        instruction:
          "Crack the eggs into a container, and mix the yolk with the egg white",
      },
      {
        step: 3,
        instruction:
          "Then put the contents into the pan, and mix it with the vegetables",
      },
      {
        step: 4,
        instruction: "Cook until one side starts to finish",
      },
      {
        step: 5,
        instruction: "Then place half the surface over the other",
      },
      {
        step: 6,
        instruction: "Voila!",
      },
    ],
    ingredients: [
      { ...ingredients[8], amount: 10, unit: "Unit" },
      { ...ingredients[3], amount: 4, unit: "Unit" },
      { ...ingredients[9], amount: 8, unit: "Unit" },
      { ...ingredients[10], amount: 1, unit: "Unit" },
      { ...ingredients[11], amount: 100, unit: "Gram" },
      { ...ingredients[12], amount: 1, unit: "Unit" },
    ],
  },
  {
    id: 5,
    image_id: 5,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[2].name,
    title: "Raspeball",
    description: "Good food for a confirmation!",
    recipe: [
      {
        step: 1,
        instruction:
          "Finely chop the potatoes so that it can be shaped like a dough",
      },
      {
        step: 2,
        instruction: "Put in water and flour together with the potatoes",
      },
      {
        step: 3,
        instruction: "Put in more flour so that it becomes firmer",
      },
      {
        step: 4,
        instruction: "Form balls from the dough, and put them to steam",
      },
      {
        step: 5,
        instruction: "Leave the steaming for 30 minutes",
      },
      {
        step: 6,
        instruction:
          "While they are cooking, cut up the carrots and mix them in with the sugar and citric acid",
      },
      {
        step: 7,
        instruction:
          "When 20 minutes have passed, start frying the sausages and meatballs",
      },
      {
        step: 8,
        instruction: "Remove the balls, and serve the good food!",
      },
    ],
    ingredients: [
      { ...ingredients[3], amount: 50, unit: "Unit" },
      { ...ingredients[4], amount: 2, unit: "tbsp" },
      { ...ingredients[5], amount: 3, unit: "tbsp" },
      { ...ingredients[6], amount: 200, unit: "Gram" },
      { ...ingredients[14], amount: 600, unit: "Gram" },
      { ...ingredients[15], amount: 1, unit: "Kilogram" },
      { ...ingredients[16], amount: 30, unit: "Unit" },
      { ...ingredients[17], amount: 10, unit: "tbsp" },
    ],
  },
  {
    id: 6,
    image_id: 6,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[3].name,
    title: "Brownie",
    description: "A delicious brownie!",
    recipe: [
      {
        step: 1,
        instruction:
          "Mix together flour, cocoa, baking soda, sugar and water to form the batter",
      },
      {
        step: 2,
        instruction: "Pour this into a mold and place in the oven at 220 °C",
      },
      {
        step: 3,
        instruction:
          "Mix together more chocolate and cocoa with sugar and butter to form the buttercream",
      },
      {
        step: 4,
        instruction:
          "Take the cake out after it has been inside for 45 minutes",
      },
      {
        step: 5,
        instruction:
          "Cut the cake in half and put the cream on it and inside it",
      },
      {
        step: 6,
        instruction:
          "Then decorate with tutti frutti on top before the cream sets",
      },
      {
        step: 7,
        instruction: "Yummy!",
      },
    ],
    ingredients: [
      { ...ingredients[6], amount: 500, unit: "Gram" },
      { ...ingredients[7], amount: 200, unit: "Gram" },
      { ...ingredients[14], amount: 800, unit: "Gram" },
      { ...ingredients[18], amount: 20, unit: "tbsp" },
      { ...ingredients[19], amount: 250, unit: "Gram" },
      { ...ingredients[20], amount: 600, unit: "Gram" },
      { ...ingredients[21], amount: 4, unit: "tsp" },
    ],
  },
  {
    id: 7,
    image_id: 7,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[4].name,
    title: "Sodd",
    description: "Good sodd that is loyal to Trøndelag",
    recipe: [
      {
        step: 1,
        instruction:
          "Chop up the potatoes and carrots and cook them in separate saucepans",
      },
      {
        step: 2,
        instruction:
          "Then cook the Sodd balls in a separate saucepan with broth for 10 minutes",
      },
      {
        step: 3,
        instruction:
          "Then put everything together in the same saucepan, and serve",
      },
    ],
    ingredients: [
      { ...ingredients[3], amount: 10, unit: "Unit" },
      { ...ingredients[4], amount: 1, unit: "tbsp" },
      { ...ingredients[5], amount: 4, unit: "tbsp" },
      { ...ingredients[16], amount: 5, unit: "Unit" },
      { ...ingredients[22], amount: 500, unit: "Gram" },
      { ...ingredients[23], amount: 2, unit: "Unit" },
    ],
  },
  {
    id: 8,
    image_id: 8,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[4].name,
    title: "Spaghetti",
    description: "Real Italian recipe!",
    recipe: [
      {
        step: 1,
        instruction:
          "Put the spaghetti in a saucepan and cook it for 10 minutes",
      },
      {
        step: 2,
        instruction:
          "Then fry the minced meat in a pan, and make bolognese sauce from chopped tomatoes",
      },
      {
        step: 3,
        instruction:
          "When the spaghetti is done, pour off the water and let the sauce cook for another 5 minutes",
      },
      {
        step: 4,
        instruction: "Serve with parmesan on top. Enjoy yourself!",
      },
    ],
    ingredients: [
      { ...ingredients[9], amount: 20, unit: "Unit" },
      { ...ingredients[24], amount: 500, unit: "Gram" },
      { ...ingredients[25], amount: 500, unit: "Gram" },
      { ...ingredients[26], amount: 50, unit: "Gram" },
    ],
  },
  {
    id: 9,
    image_id: 9,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[2].name,
    title: "Taco",
    description: "Mexican dish that will blow your mind!",
    recipe: [
      {
        step: 1,
        instruction: "Chop up all the vegetables and put each in a bowl",
      },
      {
        step: 2,
        instruction:
          "Then fry the minced meat in a pan, and add taco seasoning",
      },
      {
        step: 3,
        instruction: "Serve while hot with taco shells",
      },
      {
        step: 4,
        instruction: "Enjoy!",
      },
    ],
    ingredients: [
      { ...ingredients[9], amount: 10, unit: "Unit" },
      { ...ingredients[10], amount: 4, unit: "Unit" },
      { ...ingredients[11], amount: 150, unit: "Gram" },
      { ...ingredients[12], amount: 3, unit: "Unit" },
      { ...ingredients[13], amount: 2, unit: "Unit" },
      { ...ingredients[25], amount: 600, unit: "Gram" },
      { ...ingredients[27], amount: 250, unit: "Gram" },
      { ...ingredients[28], amount: 25, unit: "Unit" },
      { ...ingredients[29], amount: 3, unit: "Unit" },
      { ...ingredients[30], amount: 11, unit: "Unit" },
      { ...ingredients[31], amount: 20, unit: "Unit" },
    ],
  },
  {
    id: 10,
    image_id: 10,
    date: new Date("2024-03-21T18:53:32.000Z"),
    username: users[3].name,
    title: "Cake",
    description: "Cake with some fun surprises inside",
    recipe: [
      {
        step: 1,
        instruction:
          "Mix together flour, baking soda, sugar, tutti frutti and water to form the batter",
      },
      {
        step: 2,
        instruction: "Pour it into a mold and put it in the oven at 220 °C",
      },
      {
        step: 3,
        instruction:
          "Mix together more sugar and butter to form the buttercream",
      },
      {
        step: 4,
        instruction:
          "Take the cake out after it has been inside for 60 minutes",
      },
      {
        step: 5,
        instruction:
          "Cut the cake in half and put the cream on it and inside it",
      },
      {
        step: 6,
        instruction:
          "Then decorate with tutti frutti on top before the cream sets",
      },
      {
        step: 7,
        instruction: "Tasty!",
      },
    ],
    ingredients: [
      { ...ingredients[6], amount: 500, unit: "Gram" },
      { ...ingredients[14], amount: 800, unit: "Gram" },
      { ...ingredients[19], amount: 400, unit: "Gram" },
      { ...ingredients[20], amount: 600, unit: "Gram" },
      { ...ingredients[21], amount: 4, unit: "tsp" },
    ],
  },
];

const fridge_ingredients: UnitIngredient[][] = [
  /* 1 */ [
    {
      ingredient: "Cattle",
      stdunits: ["Kilogram", "Gram"],
      kcalper100gram: 250,
      amount: 200,
      unit: "Gram",
    },
    {
      ingredient: "Cale",
      stdunits: ["Unit", "Kilogram", "Gram"],
      kcalper100gram: 10,
      amount: 20,
      unit: "Unit",
    },
    {
      ingredient: "Sheep",
      stdunits: ["Kilogram", "Gram"],
      kcalper100gram: 200,
      amount: 170,
      unit: "Gram",
    },
  ],
  /* 2 */ [
    {
      ingredient: "Potato",
      stdunits: ["Unit", "Kilogram", "Gram"],
      kcalper100gram: 50,
      amount: 200,
      unit: "Unit",
    },
    {
      ingredient: "Pepper",
      stdunits: ["tsp", "tbsp"],
      kcalper100gram: 0,
      amount: 200,
      unit: "tbsp",
    },
    {
      ingredient: "Salt",
      stdunits: ["tsp", "tbsp"],
      kcalper100gram: 0,
      amount: 200,
      unit: "tsp",
    },
  ],
  /* 3 */ [
    /* 6 */ {
      ingredient: "Sugar",
      stdunits: ["tsp", "tbsp", "Liter", "Kilogram", "Gram"],
      kcalper100gram: 100,
      amount: 5000,
      unit: "Liter",
    },
    /* 7 */ {
      ingredient: "Chocolate",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 250,
      amount: 1600,
      unit: "Gram",
    },
    /* 8 */ {
      ingredient: "Egg",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 80,
      amount: 150,
      unit: "Unit",
    },
    /* 9 */ {
      ingredient: "Tomato",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 40,
      amount: 200,
      unit: "Unit",
    },
    /* 10 */ {
      ingredient: "Spring onions",
      stdunits: ["Unit"],
      kcalper100gram: 80,
      amount: 7,
      unit: "Unit",
    },
    /* 11 */ {
      ingredient: "Cheese",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 140,
      amount: 200,
      unit: "Gram",
    },
    /* 12 */ {
      ingredient: "Shallots",
      stdunits: ["Unit"],
      kcalper100gram: 30,
      amount: 5,
      unit: "Unit",
    },
    /* 13 */ {
      ingredient: "Red onion",
      stdunits: ["Unit"],
      kcalper100gram: 40,
      amount: 20,
      unit: "Unit",
    },
    /* 14 */ {
      ingredient: "Flour",
      stdunits: ["Liter", "Kilogram", "Gram", "tbsp"],
      kcalper100gram: 70,
      amount: 300,
      unit: "Gram",
    },
    /* 15 */ {
      ingredient: "Sausage",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 300,
      amount: 100,
      unit: "Kilogram",
    },
    /* 16 */ {
      ingredient: "Carrot",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 55,
      amount: 500,
      unit: "Unit",
    },
    /* 17 */ {
      ingredient: "Citric acid",
      stdunits: ["Liter", "tbsp", "tsp"],
      kcalper100gram: 55,
      amount: 10,
      unit: "Liter",
    },
    /* 18 */ {
      ingredient: "Cocoa",
      stdunits: ["Liter", "Kilogram", "Gram", "tbsp", "tsp"],
      kcalper100gram: 20,
      amount: 400,
      unit: "Gram",
    },
    /* 19 */ {
      ingredient: "Tutti frutti",
      stdunits: ["Kilogram", "Gram"],
      kcalper100gram: 30,
      amount: 200,
      unit: "Kilogram",
    },
  ],
  /* 4 */ [
    /* 20 */ {
      ingredient: "Butter",
      stdunits: ["Kilogram", "Gram"],
      kcalper100gram: 200,
      amount: 200,
      unit: "Gram",
    },
    /* 21 */ {
      ingredient: "Baking soda",
      stdunits: ["tbsp", "tsp"],
      kcalper100gram: 5,
      amount: 200,
      unit: "tbsp",
    },
    /* 22 */ {
      ingredient: "Sodd ball",
      stdunits: ["Kilogram", "Gram"],
      kcalper100gram: 90,
      amount: 400,
      unit: "Gram",
    },
    /* 23 */ {
      ingredient: "Broth",
      stdunits: ["Unit"],
      kcalper100gram: 20,
      amount: 200,
      unit: "Unit",
    },
    /* 24 */ {
      ingredient: "Spaghetti",
      stdunits: ["Kilogram", "Gram"],
      kcalper100gram: 80,
      amount: 600,
      unit: "Gram",
    },
    /* 25 */ {
      ingredient: "Minced meat",
      stdunits: ["Kilogram", "Gram"],
      kcalper100gram: 150,
      amount: 10,
      unit: "Kilogram",
    },
  ],
  /* 5 */ [
    /* 26 */ {
      ingredient: "Parmesan",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 170,
      amount: 500,
      unit: "Gram",
    },
    /* 27 */ {
      ingredient: "Cheddar",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 180,
      amount: 3,
      unit: "Kilogram",
    },
    /* 28 */ {
      ingredient: "Taco shell",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 75,
      amount: 200,
      unit: "Gram",
    },
    /* 29 */ {
      ingredient: "Chili",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 30,
      amount: 150,
      unit: "Unit",
    },
    {
      ingredient: "Bell pepper",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 25,
      amount: 300,
      unit: "Gram",
    },
    {
      ingredient: "Cucumber",
      stdunits: ["Kilogram", "Gram", "Unit"],
      kcalper100gram: 2,
      amount: 4,
      unit: "Unit",
    },
  ],
];
const displayrecipes: DisplayRecipe[] = recipes.map((r) => {
  return {
    id: r.id,
    image_id: r.image_id,
    description: r.description,
    date: r.date,
    title: r.title,
    username: r.username,
  };
});

const shopping_list: Shopping_list[] = [
  [
    {
      id: 1,
      recipe: displayrecipes[0],
      ingredients: recipes[0].ingredients,
    },
    {
      id: 2,
      recipe: displayrecipes[1],
      ingredients: recipes[1].ingredients,
    },
  ],
  [
    {
      id: 3,
      recipe: displayrecipes[3],
      ingredients: recipes[3].ingredients,
    },
  ],
  [
    {
      id: 4,
      recipe: displayrecipes[4],
      ingredients: recipes[4].ingredients,
    },
  ],
  [
    {
      id: 5,
      recipe: displayrecipes[1],
      ingredients: recipes[1].ingredients,
    },
  ],
  [
    {
      id: 6,
      recipe: displayrecipes[7],
      ingredients: recipes[7].ingredients,
    },
  ],
];

const favorites: Favorite[][] = [
  [{ recipe_id: 1 }, { recipe_id: 2 }, { recipe_id: 3 }],
  [{ recipe_id: 4 }, { recipe_id: 2 }, { recipe_id: 8 }],
  [{ recipe_id: 3 }, { recipe_id: 7 }],
  [{ recipe_id: 3 }, { recipe_id: 5 }],
  [],
];

const ratings: RatingCreate[][] = [
  [
    { rating: 3, recipe_id: 1 },
    { rating: 2, recipe_id: 2 },
    { rating: 1, recipe_id: 3 },
  ],
  [
    { rating: 5, recipe_id: 5 },
    { rating: 3, recipe_id: 4 },
    { rating: 2, recipe_id: 1 },
  ],
  [
    { rating: 5, recipe_id: 5 },
    { rating: 3, recipe_id: 4 },
    { rating: 2, recipe_id: 1 },
  ],
  [],
  [
    { rating: 4, recipe_id: 4 },
    { rating: 5, recipe_id: 2 },
    { rating: 1, recipe_id: 3 },
  ],
];

axios.defaults.baseURL = "http://localhost:3000/api/v1";
axios.defaults.withCredentials = true;

export async function IntegrationData() {
  await restartFunc();
  await startUpFunc();

  // Images
  let nextId = 1;
  for (const i of images) {
    await pool.query("INSERT INTO images (id, image, type) VALUES (?, ?, ?)", [
      nextId++,
      i.image,
      i.type,
    ]);
  }

  // Users
  for (const u of users) {
    const hashed_password = await loginService.hash(u.password);
    await pool.query(
      "INSERT INTO users (name, password, image_id) VALUES (?, ?, ?)",
      [u.name, hashed_password, u.image_id]
    );
  }

  // Ingredients
  for (const i of ingredients) {
    await pool.query(
      "INSERT INTO ingredients (ingredient, kcalper100gram, stdunits) VALUES (?, ?, ?)",
      [i.ingredient, i.kcalper100gram, JSON.stringify(i.stdunits)]
    );
  }

  //fridge_ingredients
  nextId = 0;
  for (const il of fridge_ingredients) {
    for (const i of il) {
      await pool.query(
        "INSERT INTO fridge_ingredients (username, ingredient, amount, unit) VALUES (?, ?, ?, ?)",
        [users[nextId].name, i.ingredient, i.amount, i.unit]
      );
    }
    nextId++;
  }

  // Recipes
  for (const r of recipes) {
    await pool.query(
      "INSERT INTO recipes (id, username, title, description, image_id, date) VALUES (?, ?, ? ,? ,?, ?)",
      [r.id, r.username, r.title, r.description, r.image_id, r.date]
    );
    for (const s of r.recipe) {
      await pool.query(
        "INSERT INTO recipe_steps (recipe_id, step, instruction) VALUES (?, ?, ?)",
        [r.id, s.step, s.instruction]
      );
    }
    for (const i of r.ingredients) {
      await pool.query(
        "INSERT INTO recipe_ingredients (recipe_id, ingredient, amount, unit) VALUES (?, ?, ?, ?)",
        [r.id, i.ingredient, i.amount, i.unit]
      );
    }
  }

  // Ratings
  nextId = 0;
  for (const rl of ratings) {
    for (const r of rl) {
      await pool.query(
        "INSERT INTO ratings (recipe_id, username, rating) VALUES (?, ?, ?)",
        [r.recipe_id, users[nextId].name, r.rating]
      );
    }
    nextId++;
  }

  // Favorites
  nextId = 0;
  for (const fl of favorites) {
    for (const f of fl) {
      await pool.query(
        "INSERT INTO favorites (recipe_id, username) VALUES (?, ?)",
        [f.recipe_id, users[nextId].name]
      );
    }
    nextId++;
  }

  // Shoppinglist
  nextId = 0;
  for (const sl of shopping_list) {
    for (const s of sl) {
      await pool.query(
        "INSERT INTO shopping_lists (id, recipe_id, username) VALUES (?, ?, ?)",
        [s.id, s.recipe.id, users[nextId].name]
      );
      for (const i of s.ingredients) {
        await pool.query(
          "INSERT INTO shopping_list_ingredients (shoppinglist_id, ingredient, amount, unit) VALUES (?, ?, ?, ?)",
          [s.id, i.ingredient, i.amount, i.unit]
        );
      }
    }
    nextId++;
  }

  console.log("Finished SQL data");
}

export const integrationdata = {
  favorites: favorites,
  users: users,
  recipes: recipes,
  ratings: ratings,
  shopping_list: shopping_list,
  ingredients: ingredients,
  fridge_ingredients: fridge_ingredients,
  images: images,
  displayrecipes: displayrecipes,
};
