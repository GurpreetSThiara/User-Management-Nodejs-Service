// /controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import redisClient from '../config/redis';

export const register = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    password,
    profile_image,
    headline,
    summary,
    experience = [],
    education = [],
    skills = [],
    location,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with all fields
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      profile_image,
      headline,
      summary,
      experience,
      education,
      skills,
      location,
      connections: [], // Initialize as an empty array
      connection_requests: [], // Initialize as an empty array
      settings: {
        visibility: 'public', // Default value
        notifications: {
          email_notifications: true, // Default value
          sms_notifications: false, // Default value
        },
      },
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user : any = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in Redis
    await redisClient.set(user._id.toString(), refreshToken);

    // Cache user data
    await redisClient.set(`user:${user._id}`, JSON.stringify(user), {
      EX: 3600,
    });

    // Set tokens in cookies
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
export const logout = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    // Delete refresh token from Redis
    await redisClient.del(userId);

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};
