// src/utils/responseUtils.ts
import { Response } from 'express';

export const SuccessResponse = (res: Response, message: string, data: any = null, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const FailedResponse = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
