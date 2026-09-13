import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import Order, { type IOrderItem, type OrderStatus } from "../models/Order";
import Product from "../models/Product";
import { getOrCreateSettings } from "./settings.controller";
import { generateOrderReceiptNumber } from "../services/receiptNumber.service";
import { stkPush } from "../services/mpesa.service";

interface CreateOrderItemInput {
  productId: string;
  size: string;
  colour: string;
  qty: number;
}

interface CreateOrderBody {
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    location?: string;
  };
  items?: CreateOrderItemInput[];
}

const VALID_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function createOrder(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateOrderBody;
  const customer = body.customer;
  const requestedItems = body.items;

  if (!customer?.name || !customer.phone || !customer.location) {
    throw new AppError("Customer name, phone, and location are required", 400);
  }

  if (!requestedItems || requestedItems.length === 0) {
    throw new AppError("At least one item is required", 400);
  }

  const items: IOrderItem[] = [];

  for (const requested of requestedItems) {
    const product = await Product.findById(requested.productId);

    if (!product) {
      throw new AppError(`Product not found: ${requested.productId}`, 404);
    }

    if (product.stock < requested.qty) {
      throw new AppError(`Insufficient stock for ${product.title}`, 409);
    }

    items.push({
      productId: product._id,
      title: product.title,
      size: requested.size,
      colour: requested.colour,
      qty: requested.qty,
      unitPrice: product.price,
      lineTotal: product.price * requested.qty,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const settings = await getOrCreateSettings();
  const shipping = settings.shippingFee;
  const total = subtotal + shipping;

  const receiptNumber = await generateOrderReceiptNumber();

  const order = await Order.create({
    receiptNumber,
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      location: customer.location,
    },
    items,
    subtotal,
    shipping,
    total,
    paymentStatus: "pending",
    orderStatus: "pending",
  });

  try {
    const stkResult = await stkPush(customer.phone, total, receiptNumber, "SHINKUSEN Order");
    order.mpesaCheckoutRequestId = stkResult.CheckoutRequestID;
    await order.save();
  } catch (err) {
    console.error("STK push failed for order", receiptNumber, err);
  }

  res.status(201).json({ success: true, data: order });
}

export async function trackOrder(req: Request, res: Response): Promise<void> {
  const { phone, receipt } = req.query as { phone?: string; receipt?: string };

  if (!phone && !receipt) {
    throw new AppError("Provide a phone number or receipt number", 400);
  }

  if (receipt) {
    const order = await Order.findOne({ receiptNumber: receipt });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.json({ success: true, data: order });
    return;
  }

  const orders = await Order.find({ "customer.phone": phone }).sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
}

export async function getAllOrdersAdmin(_req: Request, res: Response): Promise<void> {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  const { orderStatus } = req.body as { orderStatus?: OrderStatus };

  if (!orderStatus || !VALID_ORDER_STATUSES.includes(orderStatus)) {
    throw new AppError("Invalid orderStatus", 400);
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  res.json({ success: true, data: order });
}
