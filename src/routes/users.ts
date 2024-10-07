// /routes/users.ts
import { Router } from 'express';
import { getUser, updateUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddlewares';
//import { cacheMiddleware } from '../middlewares/cacheMiddleware';

const router = Router();

router.get('/:userId', authenticateToken, getUser);
router.put('/:userId', authenticateToken, updateUser);

export default router;
