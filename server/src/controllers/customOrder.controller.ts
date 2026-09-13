import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import CustomOrder, { type CustomOrderPlacement, type CustomOrderStatus } from "../models/CustomOrder";
import { generateCustomOrderReceiptNumber } from "../services/receiptNumber.service";
import { notifyAdminNewCustomOrder } from "../services/whatsapp.service";

const VALID_PLACEMENTS: CustomOrderPlacement[] = [
  "left_chest",
  "center_chest",
  "full_back",
  "left_sleeve",
];

const VALID_STATUSES: CustomOrderStatus[] = ["pending", "in_review", "confirmed", "completed", "cancelled"];

interface CreateCustomOrderBody {
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    location?: string;
  };
  garmentType?: string;
  placement?: CustomOrderPlacement;
  notes?: string;
  referenceImages?: string[];
}

export async function createCustomOrder(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateCustomOrderBody;
  const customer = body.customer;

  if (!customer?.name || !customer.phone || !customer.location) {
    throw new AppError("Customer name, phone, and location are required", 400);
  }

  if (!body.garmentType) {
    throw new AppError("garmentType is required", 400);
  }

  if (!body.placement || !VALID_PLACEMENTS.includes(body.placement)) {
    throw new AppError("A valid placement is required", 400);
  }

  const receiptNumber = await generateCustomOrderReceiptNumber();

  const customOrder = await CustomOrder.create({
    receiptNumber,
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      location: customer.location,
    },
    garmentType: body.garmentType,
    placement: body.placement,
    notes: body.notes ?? "",
    referenceImages: body.referenceImages ?? [],
  });

  await notifyAdminNewCustomOrder(customOrder);

  res.status(201).json({ success: true, data: customOrder });
}

export async function getAllCustomOrdersAdmin(_req: Request, res: Response): Promise<void> {
  const customOrders = await CustomOrder.find().sort({ createdAt: -1 });
  res.json({ success: true, data: customOrders });
}

export async function updateCustomOrderStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body as { status?: CustomOrderStatus };

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const customOrder = await CustomOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });

  if (!customOrder) {
    throw new AppError("Custom order not found", 404);
  }

  res.json({ success: true, data: customOrder });
}
