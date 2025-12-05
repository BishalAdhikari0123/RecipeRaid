import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getIngredients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, rarity, isPremium } = req.query;

    let query = 'SELECT * FROM ingredients WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (rarity) {
      query += ` AND rarity = $${paramCount}`;
      values.push(rarity);
      paramCount++;
    }

    if (isPremium !== undefined) {
      query += ` AND is_premium = $${paramCount}`;
      values.push(isPremium === 'true');
      paramCount++;
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, values);

    res.json({ ingredients: result.rows });
  } catch (error) {
    console.error('Get ingredients error:', error);
    res.status(500).json({ error: 'Failed to get ingredients' });
  }
};

export const getUserPantry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await pool.query(
      `SELECT up.*, i.name, i.category, i.rarity, i.is_premium, i.power_up_effect
       FROM user_pantry up
       JOIN ingredients i ON up.ingredient_id = i.id
       WHERE up.user_id = $1
       ORDER BY i.name`,
      [userId]
    );

    res.json({ pantry: result.rows });
  } catch (error) {
    console.error('Get user pantry error:', error);
    res.status(500).json({ error: 'Failed to get user pantry' });
  }
};

export const addToPantry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { ingredientId, quantity } = req.body;

    // Check if ingredient exists
    const ingredient = await pool.query(
      'SELECT * FROM ingredients WHERE id = $1',
      [ingredientId]
    );

    if (ingredient.rows.length === 0) {
      res.status(404).json({ error: 'Ingredient not found' });
      return;
    }

    // Check if ingredient requires premium
    if (ingredient.rows[0].is_premium && !req.user!.isPremium) {
      res.status(403).json({ error: 'Premium subscription required for this ingredient' });
      return;
    }

    // Check if already exists in pantry
    const existing = await pool.query(
      'SELECT * FROM user_pantry WHERE user_id = $1 AND ingredient_id = $2',
      [userId, ingredientId]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update quantity
      result = await pool.query(
        `UPDATE user_pantry
         SET quantity = quantity + $1
         WHERE user_id = $2 AND ingredient_id = $3
         RETURNING *`,
        [quantity || 1, userId, ingredientId]
      );
    } else {
      // Insert new
      result = await pool.query(
        `INSERT INTO user_pantry (user_id, ingredient_id, quantity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, ingredientId, quantity || 1]
      );
    }

    res.status(201).json({ pantryItem: result.rows[0] });
  } catch (error) {
    console.error('Add to pantry error:', error);
    res.status(500).json({ error: 'Failed to add to pantry' });
  }
};
