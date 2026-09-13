import twilioClient from "../config/twilio";
import type { IOrder } from "../models/Order";
import type { ICustomOrder } from "../models/CustomOrder";
import type { IProduct } from "../models/Product";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254")) return `+${digits}`;
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  if (digits.startsWith("+")) return phone;

  return `+254${digits}`;
}

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;
}

async function sendWhatsApp(to: string, body: string, mediaUrl?: string): Promise<boolean> {
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!twilioClient || !from) {
    console.warn("Twilio is not configured. Skipping WhatsApp message to", to);
    return false;
  }

  try {
    await twilioClient.messages.create({
      from: `whatsapp:${from.replace(/^whatsapp:/, "")}`,
      to: `whatsapp:${normalizePhone(to)}`,
      body,
      ...(mediaUrl ? { mediaUrl: [mediaUrl] } : {}),
    });
    return true;
  } catch (err) {
    console.error("Failed to send WhatsApp message to", to, err);
    return false;
  }
}

export async function notifyAdminOrderPlaced(order: IOrder): Promise<boolean> {
  const adminNumber = process.env.WA_ADMIN_NUMBER;

  if (!adminNumber) {
    console.warn("WA_ADMIN_NUMBER is not set. Skipping order placed alert.");
    return false;
  }

  const itemLines = order.items.map((item) => `${item.qty}x ${item.title} (${item.size}, ${item.colour})`);

  const body = [
    "New order placed on SHINKUSEN",
    "AWAITING PAYMENT",
    `Receipt: ${order.receiptNumber}`,
    `Customer: ${order.customer.name}, ${order.customer.phone}`,
    `Location: ${order.customer.location}`,
    "Items:",
    ...itemLines,
    `Total: ${formatKes(order.total)}`,
  ].join("\n");

  return sendWhatsApp(adminNumber, body);
}

export async function notifyAdminPaidOrder(order: IOrder): Promise<boolean> {
  const adminNumber = process.env.WA_ADMIN_NUMBER;

  if (!adminNumber) {
    console.warn("WA_ADMIN_NUMBER is not set. Skipping paid order alert.");
    return false;
  }

  const itemLines = order.items.map((item) => `${item.qty}x ${item.title} (${item.size}, ${item.colour})`);

  const body = [
    "New paid order received on SHINKUSEN",
    `Receipt: ${order.receiptNumber}`,
    `Customer: ${order.customer.name}, ${order.customer.phone}`,
    `Location: ${order.customer.location}`,
    "Items:",
    ...itemLines,
    `Total: ${formatKes(order.total)}`,
  ].join("\n");

  return sendWhatsApp(adminNumber, body, order.receiptUrl ?? undefined);
}

export async function notifyCustomerOrderConfirmed(order: IOrder): Promise<boolean> {
  const clientUrl = process.env.CLIENT_URL ?? "";
  const trackLink = `${clientUrl}/track?receipt=${order.receiptNumber}`;

  const body = [
    "Thank you for your order at SHINKUSEN.",
    "Your payment has been confirmed.",
    `Receipt: ${order.receiptNumber}`,
    `Total paid: ${formatKes(order.total)}`,
    `Track your order here: ${trackLink}`,
  ].join("\n");

  return sendWhatsApp(order.customer.phone, body, order.receiptUrl ?? undefined);
}

export async function notifyAdminLowStock(product: IProduct): Promise<boolean> {
  const adminNumber = process.env.WA_ADMIN_NUMBER;

  if (!adminNumber) {
    console.warn("WA_ADMIN_NUMBER is not set. Skipping low stock alert.");
    return false;
  }

  const body = [
    "Low stock alert on SHINKUSEN",
    `${product.title} has ${product.stock} units left`,
    `Threshold: ${product.lowStockThreshold}`,
  ].join("\n");

  return sendWhatsApp(adminNumber, body);
}

export async function notifyAdminNewCustomOrder(customOrder: ICustomOrder): Promise<boolean> {
  const adminNumber = process.env.WA_ADMIN_NUMBER;

  if (!adminNumber) {
    console.warn("WA_ADMIN_NUMBER is not set. Skipping custom order alert.");
    return false;
  }

  const body = [
    "New custom order request on SHINKUSEN",
    `Receipt: ${customOrder.receiptNumber}`,
    `Garment: ${customOrder.garmentType}`,
    `Placement: ${customOrder.placement}`,
    `Customer: ${customOrder.customer.name}, ${customOrder.customer.phone}`,
  ].join("\n");

  return sendWhatsApp(adminNumber, body);
}
