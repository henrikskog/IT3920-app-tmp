INSERT INTO
    users (name, password)
VALUES
    ('Arne', 'passord'),
    ('Ole', 'passord'),
    ('Ola Nordmann', 'passord');

INSERT INTO
    recipes (username, title, description)
VALUES
    ('Arne', 'Pasta', 'En digg pasta fra Italia'),
    ('Ole', 'Pizza', 'En digg pizza fra Italia'),
    ('Ole', 'Grøt', 'En god grøt');

INSERT INTO
    recipe_steps (recipe_id, step, instruction)
VALUES
    (1, 1, 'Varm opp vann.'),
    (1, 2, 'Lag Pasta.'),
    (1, 3, 'Nyt!'),
    (2, 1, 'Varm opp ovnen.'),
    (2, 2, 'Lag Pizza.'),
    (2, 3, 'Nyt!'),
    (3, 1, 'Finn fram ingredienser.'),
    (3, 2, 'Lag Grøten.'),
    (3, 3, 'Nyt!');

INSERT INTO
    ingredients (ingredient, kcalper100gram, stdunits)
VALUES
    ('pasta', 1, "[\"Stykk\"]"),
    ('vann', 1, "[\"Stykk\"]"),
    ('pizzadeig', 1, "[\"Stykk\"]"),
    ('ost', 1, "[\"Stykk\"]"),
    ('tomatsaus', 1, "[\"Stykk\", \"Kilogram\"]"),
    ('sukker', 1, "[\"Stykk\"]"),
    ('ris', 1, "[\"Stykk\", \"Liter\"]");

INSERT INTO
    recipe_ingredients (recipe_id, ingredient, amount, unit)
VALUES
    (1, 'pasta', 4, 'Stykk'),
    (1, 'vann', 7, 'Stykk'),
    (2, 'pizzadeig', 1, 'Stykk'),
    (2, 'ost', 4, 'Stykk'),
    (2, 'tomatsaus', 2, 'Stykk'),
    (3, 'vann', 4, 'Stykk'),
    (3, 'ris', 12, 'Stykk'),
    (3, 'sukker', 2, 'Stykk');

INSERT INTO
    favorites (recipe_id, username)
VALUES
    (2, 'Ole');

INSERT INTO
    fridge_ingredients (username, ingredient, amount, unit)
VALUES
    ('Ole', 'ris', 27, 'Stykk'),
    ('Ole', 'sukker', 14, 'Stykk'),
    ('Ole', 'vann', 33, 'Stykk'),
    ('Ole', 'pasta', 3, 'Stykk');

INSERT INTO
    shopping_lists (recipe_id, username)
VALUES
    (1, 'Ole'),
    (3, 'Ole');

INSERT INTO
    shopping_list_ingredients (shoppinglist_id, ingredient, amount, unit)
VALUES
    (1, 'pasta', 4, 'Stykk'),
    (1, 'vann', 7, 'Stykk');

INSERT INTO 
    ratings (recipe_id, username, rating) 
VALUES
    (1, 'Ola Nordmann', 4),
    (2, 'Ola Nordmann', 5),
    (3, 'Ola Nordmann', 3);