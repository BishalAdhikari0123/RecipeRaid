import { Router } from 'express';
import { getLeaderboard, getUserRank } from '../controllers/leaderboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:period/:type', authenticate, getLeaderboard);
router.get('/rank/:userId', authenticate, getUserRank);

export default router;
