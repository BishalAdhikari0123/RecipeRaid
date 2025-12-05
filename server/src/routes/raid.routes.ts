import { Router } from 'express';
import {
  startRaid,
  completeRaid,
  getRaidDetails,
  getTeamRaids,
  uploadPhotoProof,
  abandonRaid,
} from '../controllers/raid.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { startRaidSchema, completeRaidSchema } from '../validations/raid.validation';

const router = Router();

router.post('/start', authenticate, validate(startRaidSchema), startRaid);
router.put('/:raidId/complete', authenticate, validate(completeRaidSchema), completeRaid);
router.get('/:raidId', authenticate, getRaidDetails);
router.get('/team/:teamId', authenticate, getTeamRaids);
router.post('/:raidId/photo', authenticate, uploadPhotoProof);
router.put('/:raidId/abandon', authenticate, abandonRaid);

export default router;
