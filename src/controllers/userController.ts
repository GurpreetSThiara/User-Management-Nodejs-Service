// /controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import redisClient from '../config/redis';

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cache the user data in Redis
    await redisClient.set(`user:${userId}`, JSON.stringify(user), {
      EX: 3600, // Cache expiration time in seconds (e.g., 1 hour)
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { first_name, last_name, location, skills } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { first_name, last_name, location, skills },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the cache with the new user data
    await redisClient.set(`user:${userId}`, JSON.stringify(updatedUser), {
      EX: 3600,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
