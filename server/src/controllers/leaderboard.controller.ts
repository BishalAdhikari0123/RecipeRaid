import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { period, type } = req.params; // period: daily, weekly, monthly, all_time | type: individual, team
    const limit = parseInt(req.query.limit as string) || 100;

    if (type === 'individual') {
      const result = await pool.query(
        `SELECT u.id, u.username, u.display_name, u.avatar_url,
                u.total_score as score, u.total_raids_completed as raids_completed,
                ROW_NUMBER() OVER (ORDER BY u.total_score DESC) as rank
         FROM users u
         ORDER BY u.total_score DESC
         LIMIT $1`,
        [limit]
      );

      res.json({ leaderboard: result.rows, period, type });
    } else if (type === 'team') {
      const result = await pool.query(
        `SELECT t.id, t.name, t.team_score as score,
                COUNT(DISTINCT r.id) as raids_completed,
                ROW_NUMBER() OVER (ORDER BY t.team_score DESC) as rank
         FROM teams t
         LEFT JOIN raids r ON t.id = r.team_id AND r.status = 'completed'
         GROUP BY t.id, t.name, t.team_score
         ORDER BY t.team_score DESC
         LIMIT $1`,
        [limit]
      );

      res.json({ leaderboard: result.rows, period, type });
    } else {
      res.status(400).json({ error: 'Invalid leaderboard type' });
    }
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

export const getUserRank = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT rank FROM (
         SELECT id, ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank
         FROM users
       ) ranked
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ userId, rank: result.rows[0].rank });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ error: 'Failed to get user rank' });
  }
};
