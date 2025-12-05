import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get user basic stats
    const userResult = await pool.query(
      `SELECT id, username, display_name, avatar_url, is_premium,
              total_raids_completed, total_score
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get rank
    const rankResult = await pool.query(
      `SELECT rank FROM (
         SELECT id, ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank
         FROM users
       ) ranked
       WHERE id = $1`,
      [userId]
    );

    // Get team info
    const teamResult = await pool.query(
      `SELECT t.id, t.name, tm.role
       FROM team_members tm
       JOIN teams t ON tm.team_id = t.id
       WHERE tm.user_id = $1`,
      [userId]
    );

    // Get recent raids
    const raidsResult = await pool.query(
      `SELECT r.*, rb.name as boss_name, rb.difficulty, t.name as team_name
       FROM raid_participants rp
       JOIN raids r ON rp.raid_id = r.id
       JOIN recipe_bosses rb ON r.boss_id = rb.id
       JOIN teams t ON r.team_id = t.id
       WHERE rp.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json({
      user: userResult.rows[0],
      rank: rankResult.rows[0]?.rank || null,
      teams: teamResult.rows,
      recentRaids: raidsResult.rows,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
};
