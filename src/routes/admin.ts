import { Router } from 'express';
import { authenticateAdmin, authenticateToken } from '../middlewares/authMiddlewares';
import { getAllUsers } from '../controllers/adminController';


const router = Router();

router.use(authenticateToken);
router.use(authenticateAdmin);

router.get('/all' , getAllUsers)

export default router