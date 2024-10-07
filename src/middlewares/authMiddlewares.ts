
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokenUtils';
import User from '../models/User';
import { FailedResponse } from '../utils/responseUtils';

export const authenticateToken = (req: Request | any, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = verifyAccessToken(token);
    req.userId = (decoded as { userId: string }).userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};



export const authenticateAdmin = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized access. User not found.' });
    }


    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }


    if (user.role !== 'ADMIN') {
      return FailedResponse(res,'Forbidden: You do not have admin privileges.',403)
  
    }

    req.admin = user;
   
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
