import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import Order, { type IOrderItem, type OrderStatus, type PaymentStatus } from "../models/Order";
import Product from "../models/Product";
import { getOrCreateSettings } from "./settings.controller";
import { generateOrderReceiptNumber } from "../services/receiptNumber.service";
import { notifyAdminOrderPlaced } from "../services/whatsapp.service";
import { markOrderPaid } from "../services/orderFulfillment.service";
// M-Pesa STK Push is disabled for manual-pay launch. mpesa.service.ts is kept for later.
// import { stkPush } from "../services/mpesa.service";

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

const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed"];

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
    const adminNotified = await notifyAdminOrderPlaced(order);
    order.whatsappSent = adminNotified;
    await order.save();
  } catch (err) {
    console.error("Order placed WhatsApp alert failed for order", receiptNumber, err);
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
  const body = req.body as { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus };

  if (!body.orderStatus && !body.paymentStatus) {
    throw new AppError("orderStatus or paymentStatus is required", 400);
  }

  if (body.orderStatus && !VALID_ORDER_STATUSES.includes(body.orderStatus)) {
    throw new AppError("Invalid orderStatus", 400);
  }

  if (body.paymentStatus && !VALID_PAYMENT_STATUSES.includes(body.paymentStatus)) {
    throw new AppError("Invalid paymentStatus", 400);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const wasPaid = order.paymentStatus === "paid";

  if (body.orderStatus) {
    order.orderStatus = body.orderStatus;
  }

  if (body.paymentStatus) {
    order.paymentStatus = body.paymentStatus;
  }

  if (body.paymentStatus === "paid" && !wasPaid) {
    try {
      await markOrderPaid(order);
    } catch (err) {
      console.error(`Failed to fully process paid order ${order.receiptNumber}:`, err);
      await order.save();
    }
  } else {
    await order.save();
  }

  res.json({ success: true, data: order });
}
