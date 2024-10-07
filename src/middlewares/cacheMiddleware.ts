// // /middlewares/cacheMiddleware.ts
// import { Request, Response, NextFunction } from 'express';
// // import redisClient from '../config/redis';

// export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   const { userId } = req.params;

//   try {
//     const cachedData = await redisClient.get(`user:${userId}`);
//     if (cachedData) {
//       return res.status(200).json(JSON.parse(cachedData));
//     }
//     next();
//   } catch (error) {
//     next();
//   }
// };

// export const connectionsCacheMiddleware = async (req: Request | any, res: Response, next: NextFunction) => {
//   const { userId } = req.user;

//   try {
//     const cachedConnections = await redisClient.get(`connections:${userId}`);
//     if (cachedConnections) {
//       return res.status(200).json(JSON.parse(cachedConnections));
//     }
//     next();
//   } catch (error) {
//     next();
//   }
// };
