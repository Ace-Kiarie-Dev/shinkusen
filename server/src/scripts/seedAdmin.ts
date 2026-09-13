import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import { connectDB } from "../config/db";
import User from "../models/User";

async function seedAdmin(): Promise<void> {
  const name = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD must all be set in the environment",
    );
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    console.log(`Admin user with email ${email} already exists. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    isAdmin: true,
  });

  console.log(`Admin user created: ${admin.email}`);
  await mongoose.disconnect();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("Failed to seed admin user:", err);
    process.exit(1);
  });
