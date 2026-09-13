import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { AppError } from "../middleware/errorHandler";

function uploadBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "shinkusen/products", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}

export async function uploadImages(req: Request, res: Response): Promise<void> {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    throw new AppError("No files were uploaded", 400);
  }

  try {
    const urls = await Promise.all(files.map((file) => uploadBuffer(file.buffer)));
    res.status(201).json({ success: true, data: { urls } });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new AppError("Image upload failed", 502);
  }
}
