CREATE TABLE
    IF NOT EXISTS images (
        id INT UNSIGNED AUTO_INCREMENT,
        image MEDIUMBLOB NOT NULL,
        type VARCHAR(50) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS users (
        name VARCHAR(50) NOT NULL,
        password VARCHAR(512) NOT NULL,
        image_id INT UNSIGNED DEFAULT 1,
        FOREIGN KEY (image_id) REFERENCES images (id) ON UPDATE CASCADE ON DELETE SET NULL,
        PRIMARY KEY (name)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS ingredients (
        ingredient VARCHAR(50) NOT NULL,
        kcalper100gram INT UNSIGNED NOT NULL,
        stdunits VARCHAR(200) NOT NULL,
        PRIMARY KEY (ingredient)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS fridge_ingredients (
        username VARCHAR(50) NOT NULL,
        ingredient VARCHAR(50) NOT NULL,
        amount INT UNSIGNED NOT NULL,
        unit VARCHAR(50) NOT NULL,
        FOREIGN KEY (username) REFERENCES users (name) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (ingredient) REFERENCES ingredients (ingredient) ON UPDATE CASCADE ON DELETE CASCADE,
        PRIMARY KEY (username, ingredient)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS recipes (
        id INT UNSIGNED AUTO_INCREMENT,
        username VARCHAR(50),
        title VARCHAR(200) NOT NULL,
        description VARCHAR(500) NOT NULL,
        image_id INT UNSIGNED DEFAULT 1,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NOT NULL,
        FOREIGN KEY (username) REFERENCES users (name) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (image_id) REFERENCES images (id) ON UPDATE CASCADE ON DELETE SET NULL,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS recipe_steps (
        recipe_id INT UNSIGNED NOT NULL,
        step INT UNSIGNED NOT NULL,
        instruction VARCHAR(500) NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE,
        PRIMARY KEY (recipe_id, step)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS recipe_ingredients (
        recipe_id INT UNSIGNED NOT NULL,
        ingredient VARCHAR(50) NOT NULL,
        amount INT UNSIGNED NOT NULL,
        unit VARCHAR(50) NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (ingredient) REFERENCES ingredients (ingredient) ON UPDATE CASCADE ON DELETE CASCADE,
        PRIMARY KEY (recipe_id, ingredient)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS ratings (
        recipe_id INT UNSIGNED NOT NULL,
        username VARCHAR(50),
        rating INT UNSIGNED,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (username) REFERENCES users (name) ON UPDATE CASCADE ON DELETE CASCADE,
        PRIMARY KEY (recipe_id, username)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS favorites (
        recipe_id INT UNSIGNED NOT NULL,
        username VARCHAR(50),
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (username) REFERENCES users (name) ON UPDATE CASCADE ON DELETE CASCADE,
        PRIMARY KEY (recipe_id, username)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS shopping_lists (
        id INT UNSIGNED AUTO_INCREMENT NOT NULL,
        recipe_id INT UNSIGNED NOT NULL,
        username VARCHAR(50),
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (username) REFERENCES users (name) ON UPDATE CASCADE ON DELETE CASCADE,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS shopping_list_ingredients (
        shoppinglist_id INT UNSIGNED NOT NULL,
        ingredient VARCHAR(50) NOT NULL,
        amount INT UNSIGNED NOT NULL,
        unit VARCHAR(50) NOT NULL,
        FOREIGN KEY (shoppinglist_id) REFERENCES shopping_lists (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (ingredient) REFERENCES ingredients (ingredient) ON UPDATE CASCADE ON DELETE CASCADE,
        PRIMARY KEY (shoppinglist_id, ingredient)
    ) ENGINE = InnoDB;