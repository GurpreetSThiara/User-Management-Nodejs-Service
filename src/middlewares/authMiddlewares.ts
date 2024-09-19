
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokenUtils';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = verifyAccessToken(token);
    req.body.userId = (decoded as { userId: string }).userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
