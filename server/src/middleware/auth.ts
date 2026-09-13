import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export interface AuthTokenPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Not authorized, no token provided", 401));
    return;
  }

  const token = header.slice("Bearer ".length);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    next(new AppError("JWT_SECRET is not configured", 500));
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthTokenPayload;

    if (!decoded.isAdmin) {
      next(new AppError("Not authorized as an admin", 403));
      return;
    }

    req.user = decoded;
    next();
  } catch {
    next(new AppError("Not authorized, invalid or expired token", 401));
  }
}
