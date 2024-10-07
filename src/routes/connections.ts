// /routes/users.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddlewares';
// import { connectionsCacheMiddleware } from '../middlewares/cacheMiddleware';
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getConnectionRequests,
  getConnectionsList,
} from '../controllers/connectionController';

const router = Router();

router.post('/request', authenticateToken, sendConnectionRequest);
router.post('/accept', authenticateToken, acceptConnectionRequest);
router.post('/reject', authenticateToken, rejectConnectionRequest);
router.delete('/:connectionId', authenticateToken, removeConnection);
router.get('/requests', authenticateToken, getConnectionRequests);
router.get('/', authenticateToken, getConnectionsList);

export default router;
