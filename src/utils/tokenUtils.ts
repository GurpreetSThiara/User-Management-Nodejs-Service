
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'sdfjkbtekb6jkb6b';
const REFRESH_TOKEN_SECRET = 'dmgileuteuethin34';

export const generateAccessToken = (userId: string | any) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string  | any) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string  | any) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string  | any) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
