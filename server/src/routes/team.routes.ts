import { Router } from 'express';
import {
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
  inviteMember,
  removeMember,
  leaveTeam,
  getTeamMembers,
} from '../controllers/team.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTeamSchema, updateTeamSchema, inviteMemberSchema } from '../validations/team.validation';

const router = Router();

router.post('/', authenticate, validate(createTeamSchema), createTeam);
router.get('/:teamId', authenticate, getTeam);
router.put('/:teamId', authenticate, validate(updateTeamSchema), updateTeam);
router.delete('/:teamId', authenticate, deleteTeam);
router.post('/:teamId/invite', authenticate, validate(inviteMemberSchema), inviteMember);
router.delete('/:teamId/members/:userId', authenticate, removeMember);
router.post('/:teamId/leave', authenticate, leaveTeam);
router.get('/:teamId/members', authenticate, getTeamMembers);

export default router;
