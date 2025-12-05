import { Router } from 'express';
import { getIngredients, getUserPantry, addToPantry } from '../controllers/ingredient.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getIngredients);
router.get('/pantry', authenticate, getUserPantry);
router.post('/pantry', authenticate, addToPantry);

export default router;
