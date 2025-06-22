import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('=== AUTH MIDDLEWARE START ===');
  console.log('Request path:', req.path);
  console.log('Request method:', req.method);

  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);

    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    console.log('Token found, verifying...');
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: number };

    console.log('Token verified, userId:', decoded.userId);
    (req as any).user = decoded;

    console.log('Auth middleware passed, calling next()');
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};