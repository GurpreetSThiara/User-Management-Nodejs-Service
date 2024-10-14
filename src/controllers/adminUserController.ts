import { Request, Response } from 'express';
import { FailedResponse, SuccessResponse } from '../utils/responseUtils';
import User from '../models/User';


export const getAllUsers = async (req: Request | any, res: Response) => {
  try {

    if (!req.admin) {
      return FailedResponse(res, 'Forbidden: You do not have admin privileges', 403);
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find({}, '-password')
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    // Return paginated results and total count
    const totalPages = Math.ceil(totalUsers / limit);

    return SuccessResponse(res, 'Users retrieved successfully',{
     
      users,
      meta: {
        currentPage: page,
        totalPages,
        totalUsers,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    return FailedResponse(res, 'Failed to retrieve users. Please try again later.', 500);
  }
};


export const getUserByUsername = async (req: Request | any, res: Response) => {
  try {
    if (!req.admin) {
      return FailedResponse(res, 'Forbidden: You do not have admin privileges.', 403);
    }

    const { username } = req.params;

    const user = await User.findOne({ username }, '-password');

    if (!user) {
      return FailedResponse(res, 'User not found.', 404);
    }

    return SuccessResponse(res, 'User retrieved successfully', { user });
  } catch (error) {
    console.error(error);
    return FailedResponse(res, 'Failed to retrieve user. Please try again later.', 500);
  }
};
