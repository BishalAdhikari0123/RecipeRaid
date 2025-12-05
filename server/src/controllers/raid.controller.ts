import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const startRaid = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const { teamId, bossId, mode = 'solo' } = req.body;
    const userId = req.user!.id;

    await client.query('BEGIN');

    // If team mode, check if user is in team
    if (mode === 'team' && teamId) {
      const teamMember = await client.query(
        'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',
        [teamId, userId]
      );

      if (teamMember.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(403).json({ error: 'You are not a member of this team' });
        return;
      }
    }

    // Get boss details
    const boss = await client.query(
      'SELECT * FROM recipe_bosses WHERE id = $1',
      [bossId]
    );

    if (boss.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Boss not found' });
      return;
    }

    // Create raid
    const raid = await client.query(
      `INSERT INTO raids (user_id, team_id, boss_id, mode, status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING *`,
      [userId, teamId || null, bossId, mode]
    );

    // Add user as participant
    await client.query(
      `INSERT INTO raid_participants (raid_id, user_id, individual_score)
       VALUES ($1, $2, 0)`,
      [raid.rows[0].id, userId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      raid: raid.rows[0],
      boss: boss.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Start raid error:', error);
    res.status(500).json({ error: 'Failed to start raid' });
  } finally {
    client.release();
  }
};

export const completeRaid = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const { raidId } = req.params;
    const { score, timeTakenMinutes, notes } = req.body;
    const userId = req.user!.id;

    await client.query('BEGIN');

    // Check if user is participant
    const participant = await client.query(
      'SELECT * FROM raid_participants WHERE raid_id = $1 AND user_id = $2',
      [raidId, userId]
    );

    if (participant.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(403).json({ error: 'You are not a participant in this raid' });
      return;
    }

    // Update raid
    const raid = await client.query(
      `UPDATE raids
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP,
           total_score = $1, time_taken_minutes = $2, notes = $3
       WHERE id = $4 AND status = 'active'
       RETURNING *`,
      [score, timeTakenMinutes, notes, raidId]
    );

    if (raid.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Raid not found or already completed' });
      return;
    }

    // Update user stats
    await client.query(
      `UPDATE users
       SET total_raids_completed = total_raids_completed + 1,
           total_score = total_score + $1
       WHERE id = $2`,
      [score, userId]
    );

    // Update team score if team raid
    if (raid.rows[0].team_id) {
      await client.query(
        `UPDATE teams
         SET team_score = team_score + $1
         WHERE id = $2`,
        [score, raid.rows[0].team_id]
      );
    }

    await client.query('COMMIT');

    res.json({ raid: raid.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Complete raid error:', error);
    res.status(500).json({ error: 'Failed to complete raid' });
  } finally {
    client.release();
  }
};

export const getRaidDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { raidId } = req.params;

    const result = await pool.query(
      `SELECT r.*, rb.name as boss_name, rb.description as boss_description,
              rb.difficulty, rb.required_ingredients, rb.instructions,
              t.name as team_name
       FROM raids r
       JOIN recipe_bosses rb ON r.boss_id = rb.id
       LEFT JOIN teams t ON r.team_id = t.id
       WHERE r.id = $1`,
      [raidId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Raid not found' });
      return;
    }

    // Get participants
    const participants = await pool.query(
      `SELECT rp.*, u.username, u.display_name, u.avatar_url
       FROM raid_participants rp
       JOIN users u ON rp.user_id = u.id
       WHERE rp.raid_id = $1`,
      [raidId]
    );

    res.json({
      raid: result.rows[0],
      participants: participants.rows,
    });
  } catch (error) {
    console.error('Get raid details error:', error);
    res.status(500).json({ error: 'Failed to get raid details' });
  }
};

export const getTeamRaids = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { status } = req.query;

    let query = `
      SELECT r.*, rb.name as boss_name, rb.difficulty
      FROM raids r
      JOIN recipe_bosses rb ON r.boss_id = rb.id
      WHERE r.team_id = $1
    `;

    const values: any[] = [teamId];

    if (status) {
      query += ' AND r.status = $2';
      values.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, values);

    res.json({ raids: result.rows });
  } catch (error) {
    console.error('Get team raids error:', error);
    res.status(500).json({ error: 'Failed to get team raids' });
  }
};

export const uploadPhotoProof = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { raidId } = req.params;
    const { photoUrl, storagePath } = req.body;
    const userId = req.user!.id;

    // Check if user is participant
    const participant = await pool.query(
      'SELECT * FROM raid_participants WHERE raid_id = $1 AND user_id = $2',
      [raidId, userId]
    );

    if (participant.rows.length === 0) {
      res.status(403).json({ error: 'You are not a participant in this raid' });
      return;
    }

    // Insert photo proof
    const result = await pool.query(
      `INSERT INTO photo_proofs (raid_id, user_id, photo_url, storage_path)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [raidId, userId, photoUrl, storagePath]
    );

    // Update raid with photo URL
    await pool.query(
      'UPDATE raids SET photo_proof_url = $1 WHERE id = $2',
      [photoUrl, raidId]
    );

    res.status(201).json({ photoProof: result.rows[0] });
  } catch (error) {
    console.error('Upload photo proof error:', error);
    res.status(500).json({ error: 'Failed to upload photo proof' });
  }
};

export const abandonRaid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { raidId } = req.params;
    const userId = req.user!.id;

    // Check if user is participant
    const participant = await pool.query(
      'SELECT * FROM raid_participants WHERE raid_id = $1 AND user_id = $2',
      [raidId, userId]
    );

    if (participant.rows.length === 0) {
      res.status(403).json({ error: 'You are not a participant in this raid' });
      return;
    }

    const result = await pool.query(
      `UPDATE raids SET status = 'abandoned' WHERE id = $1 AND status = 'active'
       RETURNING *`,
      [raidId]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ error: 'Raid not found or cannot be abandoned' });
      return;
    }

    res.json({ raid: result.rows[0] });
  } catch (error) {
    console.error('Abandon raid error:', error);
    res.status(500).json({ error: 'Failed to abandon raid' });
  }
};

export const getUserRaids = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { status, mode } = req.query;

    let query = `
      SELECT r.*, rb.name as boss_name, rb.difficulty, rb.difficulty_level,
             t.name as team_name
      FROM raids r
      JOIN recipe_bosses rb ON r.boss_id = rb.id
      LEFT JOIN teams t ON r.team_id = t.id
      WHERE r.user_id = $1
    `;

    const values: any[] = [userId];
    let paramCount = 2;

    if (status) {
      query += ` AND r.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (mode) {
      query += ` AND r.mode = $${paramCount}`;
      values.push(mode);
      paramCount++;
    }

    query += ' ORDER BY r.created_at DESC LIMIT 50';

    const result = await pool.query(query, values);

    res.json({ raids: result.rows });
  } catch (error) {
    console.error('Get user raids error:', error);
    res.status(500).json({ error: 'Failed to get user raids' });
  }
};

export const getAvailableBosses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { difficulty, limit = 20 } = req.query;

    let query = `
      SELECT id, name, description, difficulty, difficulty_level,
             cuisine_type, prep_time_minutes, cook_time_minutes,
             servings, base_score
      FROM recipe_bosses
    `;

    const values: any[] = [];
    let paramCount = 1;

    if (difficulty) {
      query += ` WHERE difficulty = $${paramCount}`;
      values.push(difficulty);
      paramCount++;
    }

    query += ` ORDER BY difficulty_level ASC, name ASC LIMIT $${paramCount}`;
    values.push(limit);

    const result = await pool.query(query, values);

    res.json({ bosses: result.rows });
  } catch (error) {
    console.error('Get available bosses error:', error);
    res.status(500).json({ error: 'Failed to get available bosses' });
  }
};
