import type { Request, Response } from "express";
import Settings, { type ISettings } from "../models/Settings";

export async function getOrCreateSettings(): Promise<ISettings> {
  const existing = await Settings.findOne();

  if (existing) {
    return existing;
  }

  return Settings.create({});
}

export async function getSettings(_req: Request, res: Response): Promise<void> {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: settings });
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<{
    businessName: string;
    whatsappAdminNumber: string;
    shippingFee: number;
    currency: string;
    featuredProductId: string | null;
    mpesaTillNumber: string;
    mpesaTillName: string;
  }>;

  const settings = await getOrCreateSettings();

  if (body.businessName !== undefined) settings.businessName = body.businessName;
  if (body.whatsappAdminNumber !== undefined) settings.whatsappAdminNumber = body.whatsappAdminNumber;
  if (body.shippingFee !== undefined) settings.shippingFee = body.shippingFee;
  if (body.currency !== undefined) settings.currency = body.currency;
  if (body.featuredProductId !== undefined) {
    settings.featuredProductId = body.featuredProductId as unknown as ISettings["featuredProductId"];
  }
  if (body.mpesaTillNumber !== undefined) settings.mpesaTillNumber = body.mpesaTillNumber;
  if (body.mpesaTillName !== undefined) settings.mpesaTillName = body.mpesaTillName;

  await settings.save();

  res.json({ success: true, data: settings });
}
