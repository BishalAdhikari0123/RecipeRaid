import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const { name, description } = req.body;
    const userId = req.user!.id;

    await client.query('BEGIN');

    // Create team
    const team = await client.query(
      `INSERT INTO teams (name, description, leader_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, userId]
    );

    // Add creator as leader
    await client.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, 'leader')`,
      [team.rows[0].id, userId]
    );

    await client.query('COMMIT');

    res.status(201).json({ team: team.rows[0] });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Create team error:', error);
    if (error.constraint === 'teams_name_key') {
      res.status(400).json({ error: 'Team name already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create team' });
  } finally {
    client.release();
  }
};

export const getTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const result = await pool.query(
      `SELECT t.*, u.username as leader_username, u.display_name as leader_display_name
       FROM teams t
       JOIN users u ON t.leader_id = u.id
       WHERE t.id = $1`,
      [teamId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json({ team: result.rows[0] });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to get team' });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { name, description } = req.body;
    const userId = req.user!.id;

    // Check if user is leader
    const team = await pool.query(
      'SELECT * FROM teams WHERE id = $1 AND leader_id = $2',
      [teamId, userId]
    );

    if (team.rows.length === 0) {
      res.status(403).json({ error: 'Only team leader can update team' });
      return;
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    values.push(teamId);

    const result = await pool.query(
      `UPDATE teams SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    res.json({ team: result.rows[0] });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const userId = req.user!.id;

    // Check if user is leader
    const team = await pool.query(
      'SELECT * FROM teams WHERE id = $1 AND leader_id = $2',
      [teamId, userId]
    );

    if (team.rows.length === 0) {
      res.status(403).json({ error: 'Only team leader can delete team' });
      return;
    }

    await pool.query('DELETE FROM teams WHERE id = $1', [teamId]);

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { userId: invitedUserId } = req.body;
    const userId = req.user!.id;

    // Check if user is leader or officer
    const member = await pool.query(
      `SELECT * FROM team_members 
       WHERE team_id = $1 AND user_id = $2 AND role IN ('leader', 'officer')`,
      [teamId, userId]
    );

    if (member.rows.length === 0) {
      res.status(403).json({ error: 'Only leaders and officers can invite members' });
      return;
    }

    // Check if invited user already in team
    const existing = await pool.query(
      'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',
      [teamId, invitedUserId]
    );

    if (existing.rows.length > 0) {
      res.status(400).json({ error: 'User is already a team member' });
      return;
    }

    // Add member
    const result = await pool.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, 'member')
       RETURNING *`,
      [teamId, invitedUserId]
    );

    res.status(201).json({ member: result.rows[0] });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: 'Failed to invite member' });
  }
};

export const removeMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId, userId: targetUserId } = req.params;
    const userId = req.user!.id;

    // Check if user is leader
    const leader = await pool.query(
      'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [teamId, userId, 'leader']
    );

    if (leader.rows.length === 0) {
      res.status(403).json({ error: 'Only team leader can remove members' });
      return;
    }

    // Cannot remove leader
    if (targetUserId === userId) {
      res.status(400).json({ error: 'Leader cannot be removed' });
      return;
    }

    await pool.query(
      'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2',
      [teamId, targetUserId]
    );

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

export const leaveTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;
    const userId = req.user!.id;

    // Check if user is leader
    const team = await pool.query(
      'SELECT * FROM teams WHERE id = $1 AND leader_id = $2',
      [teamId, userId]
    );

    if (team.rows.length > 0) {
      res.status(400).json({ error: 'Team leader must transfer leadership before leaving' });
      return;
    }

    await pool.query(
      'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );

    res.json({ message: 'Left team successfully' });
  } catch (error) {
    console.error('Leave team error:', error);
    res.status(500).json({ error: 'Failed to leave team' });
  }
};

export const getTeamMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamId } = req.params;

    const result = await pool.query(
      `SELECT tm.*, u.username, u.display_name, u.avatar_url, u.total_score
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1
       ORDER BY 
         CASE tm.role
           WHEN 'leader' THEN 1
           WHEN 'officer' THEN 2
           WHEN 'member' THEN 3
         END,
         tm.joined_at`,
      [teamId]
    );

    res.json({ members: result.rows });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Failed to get team members' });
  }
};
