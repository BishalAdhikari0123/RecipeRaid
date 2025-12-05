-- Seed data for Recipe Raid Co-op

-- Insert sample ingredients
INSERT INTO ingredients (name, category, rarity, is_premium, power_up_effect) VALUES
-- Common
('Salt', 'spice', 'common', FALSE, NULL),
('Black Pepper', 'spice', 'common', FALSE, NULL),
('Olive Oil', 'oil', 'common', FALSE, NULL),
('Onion', 'vegetable', 'common', FALSE, NULL),
('Garlic', 'vegetable', 'common', FALSE, NULL),
('Tomato', 'vegetable', 'common', FALSE, NULL),
('Chicken Breast', 'protein', 'common', FALSE, NULL),
('Rice', 'grain', 'common', FALSE, NULL),

-- Uncommon
('Basil', 'herb', 'uncommon', FALSE, 'time_boost'),
('Oregano', 'herb', 'uncommon', FALSE, 'time_boost'),
('Mozzarella Cheese', 'dairy', 'uncommon', FALSE, NULL),
('Parmesan Cheese', 'dairy', 'uncommon', FALSE, 'score_multiplier'),
('Bell Pepper', 'vegetable', 'uncommon', FALSE, NULL),
('Mushroom', 'vegetable', 'uncommon', FALSE, NULL),
('Ground Beef', 'protein', 'uncommon', FALSE, NULL),

-- Rare
('Truffle Oil', 'oil', 'rare', TRUE, 'score_multiplier'),
('Saffron', 'spice', 'rare', TRUE, 'score_multiplier'),
('Wagyu Beef', 'protein', 'rare', TRUE, 'score_multiplier'),
('Lobster Tail', 'seafood', 'rare', TRUE, 'score_multiplier'),
('Wild Salmon', 'seafood', 'rare', FALSE, NULL),
('Aged Balsamic Vinegar', 'condiment', 'rare', TRUE, 'time_boost'),

-- Epic
('Black Truffle', 'mushroom', 'epic', TRUE, 'score_multiplier'),
('Kobe Beef', 'protein', 'epic', TRUE, 'score_multiplier'),
('Beluga Caviar', 'seafood', 'epic', TRUE, 'score_multiplier'),
('Gold Leaf', 'garnish', 'epic', TRUE, 'difficulty_reducer'),

-- Legendary
('Dragon Fruit Essence', 'exotic', 'legendary', TRUE, 'score_multiplier'),
('Unicorn Tears Glaze', 'magical', 'legendary', TRUE, 'difficulty_reducer'),
('Phoenix Spice Mix', 'magical', 'legendary', TRUE, 'time_boost');

-- Insert sample recipe bosses
INSERT INTO recipe_bosses (name, description, difficulty, difficulty_level, cuisine_type, prep_time_minutes, cook_time_minutes, servings, base_score, required_ingredients, optional_ingredients, instructions, tips) VALUES
(
  'Spaghetti Carbonara Guardian',
  'A classic Italian pasta boss that tests your timing and technique',
  'easy',
  2,
  'Italian',
  10,
  15,
  4,
  100,
  '[{"name": "pasta", "quantity": 400}, {"name": "eggs", "quantity": 4}, {"name": "parmesan", "quantity": 100}, {"name": "bacon", "quantity": 200}]',
  '[{"name": "black_pepper", "quantity": 1}, {"name": "parsley", "quantity": 1}]',
  '["Boil water and cook pasta", "Fry bacon until crispy", "Mix eggs and parmesan", "Combine hot pasta with egg mixture", "Add bacon and serve"]',
  'The key is to not scramble the eggs - use residual heat'
),
(
  'Beef Wellington Warlord',
  'An epic boss requiring precision and multiple cooking techniques',
  'hard',
  7,
  'French',
  45,
  40,
  6,
  500,
  '[{"name": "beef_tenderloin", "quantity": 1000}, {"name": "mushrooms", "quantity": 500}, {"name": "puff_pastry", "quantity": 500}, {"name": "pate", "quantity": 200}]',
  '[{"name": "truffle_oil", "quantity": 1}, {"name": "red_wine", "quantity": 100}]',
  '["Sear beef on all sides", "Prepare mushroom duxelles", "Wrap beef in pate and mushrooms", "Encase in puff pastry", "Bake until golden", "Rest before slicing"]',
  'Use a meat thermometer for perfect doneness. Rest the meat!'
),
(
  'Ramen Emperor',
  'Master the art of authentic ramen with 12-hour broth',
  'extreme',
  9,
  'Japanese',
  720,
  60,
  4,
  800,
  '[{"name": "pork_bones", "quantity": 2000}, {"name": "ramen_noodles", "quantity": 400}, {"name": "pork_belly", "quantity": 500}, {"name": "eggs", "quantity": 4}, {"name": "nori", "quantity": 4}]',
  '[{"name": "bamboo_shoots", "quantity": 100}, {"name": "corn", "quantity": 100}, {"name": "sesame_oil", "quantity": 1}]',
  '["Simmer pork bones for 12 hours", "Prepare chashu pork belly", "Make ajitama eggs", "Cook noodles", "Assemble bowl with toppings"]',
  'The broth is everything - dont rush it!'
),
(
  'Croissant Crusader',
  'Laminated dough boss - prepare for a buttery battle',
  'medium',
  5,
  'French',
  180,
  20,
  12,
  350,
  '[{"name": "flour", "quantity": 500}, {"name": "butter", "quantity": 400}, {"name": "yeast", "quantity": 10}, {"name": "milk", "quantity": 200}]',
  '[{"name": "egg_wash", "quantity": 1}]',
  '["Make dough and chill", "Laminate with butter (3 folds)", "Chill between folds", "Roll and shape", "Proof", "Bake until golden"]',
  'Keep everything cold! Warm butter will ruin the layers.'
),
(
  'Soufflé Sorcerer',
  'A delicate boss that will collapse if you make a wrong move',
  'hard',
  8,
  'French',
  20,
  25,
  4,
  600,
  '[{"name": "eggs", "quantity": 6}, {"name": "flour", "quantity": 50}, {"name": "milk", "quantity": 250}, {"name": "cheese", "quantity": 100}]',
  '[{"name": "truffle_oil", "quantity": 1}]',
  '["Make roux base", "Add cheese", "Fold in whipped egg whites gently", "Bake without opening oven", "Serve immediately"]',
  'DO NOT open the oven door! Serve immediately or it will fall.'
);

-- Insert sample power-ups
INSERT INTO power_ups (name, description, type, effect_value, duration_minutes, is_premium, cost_coins) VALUES
('Time Turner', 'Reduces cooking time by 25%', 'time_boost', 0.25, 60, FALSE, 100),
('Score Multiplier', 'Double your raid score', 'score_multiplier', 2.0, 30, FALSE, 150),
('Ingredient Discount', 'Get 30% off grocery orders', 'ingredient_discount', 0.30, 1440, TRUE, 200),
('Master Chef Aura', 'Reduces difficulty by 1 level', 'difficulty_reducer', 1.0, 45, TRUE, 300),
('Team Boost', 'All team members get +10% score', 'team_multiplier', 1.1, 60, TRUE, 250);
