// /routes/auth.ts
import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { verifyAccessToken } from '../utils/tokenUtils';
import { authenticateToken } from '../middlewares/authMiddlewares';
import { SuccessResponse } from '../utils/responseUtils';
import User from '../models/User';

const router = Router();



router.post('/token',authenticateToken,async (req:any,res)=>{

    try {
        const user = await User.findById(req.userId);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Cache the user data in Redis
        // await redisClient.set(`user:${userId}`, JSON.stringify(user), {
        //   EX: 3600, // Cache expiration time in seconds (e.g., 1 hour)
        // });
    
        return SuccessResponse(res,'token verified successfully',user);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
  
})
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
