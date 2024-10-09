import { Router } from 'express';
import { authenticateAdmin, authenticateToken } from '../middlewares/authMiddlewares';
import { getAllUsers, getUserByUsername } from '../controllers/adminUserController';
import { getModelSchemas, getSchemas } from '../controllers/adminSchemaController';


const router = Router();

router.use(authenticateToken);
router.use(authenticateAdmin);

router.get('/all' , getAllUsers)
router.get('/userdata/:username',getUserByUsername)



router.get('/schema/all',getSchemas)

export default router