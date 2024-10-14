// /controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import { SuccessResponse, FailedResponse } from '../utils/responseUtils';

export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, password, username ,email} = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return FailedResponse(res, 'User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      first_name,
      last_name,
      username,
      lastLogin: new Date(),
      email,
      password: hashedPassword,
      settings: {
        visibility: 'public',
        notifications: {
          email_notifications: true,
          sms_notifications: false,
        },
      },
      created_at: new Date(),
      updated_at: new Date(),
    });

    await user.save();
    return SuccessResponse(res, 'User registered successfully', { user });
  } catch (error) {
    console.log(error)
    return FailedResponse(res, 'Registration failed',400);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    console.log(username)
    console.log(user)
    if (!user) return FailedResponse(res, 'Invalid credentials', 401);
   console.log(password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return FailedResponse(res, 'Invalid credentials', 401);
    console.log(password)

    // Use findOneAndUpdate to update lastLogin in one operation
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id }, 
      { lastLogin: new Date() }, 
      { new: true } // Option to return the updated document
    );

    if(!updatedUser){
      return FailedResponse(res,'something went wrong');
    }
    const accessToken = generateAccessToken(updatedUser._id);
    const refreshToken = generateRefreshToken(updatedUser._id);


    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

    const { password: _, ...userData } = updatedUser.toObject();
    console.log(updatedUser);
    console.log("fine")

    return SuccessResponse(res, 'Logged in successfully', { user: userData });
  } catch (error) {
    console.log(error)
    console.log("error")
    return FailedResponse(res, 'Login failed');
  }
};


export const logout = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return SuccessResponse(res, 'Logged out successfully');
  } catch (error) {
    return FailedResponse(res, 'Logout failed');
  }
};


