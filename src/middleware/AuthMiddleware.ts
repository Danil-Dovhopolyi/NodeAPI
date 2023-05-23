import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || '';
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}
export default function AuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    if (!token) {
      res.status(403).json({ message: 'Not authorized' });
    }
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;

    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: 'Not authorized' });
  }
}
