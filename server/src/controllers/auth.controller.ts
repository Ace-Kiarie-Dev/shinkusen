import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { signAuthToken } from "../middleware/auth";
import User from "../models/User";
import { AppError } from "../middleware/errorHandler";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signAuthToken({
    id: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin,
  });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    },
  });
}
