import type { IOrder } from "../models/Order";
import Product from "../models/Product";
import { generateReceipt } from "./receipt.service";
import { notifyAdminLowStock, notifyCustomerOrderConfirmed } from "./whatsapp.service";

// Shared by the manual admin "mark paid" flow and the dormant M-Pesa callback.
export async function markOrderPaid(order: IOrder): Promise<IOrder> {
  if (order.orderStatus === "pending") {
    order.orderStatus = "confirmed";
  }

  for (const item of order.items) {
    const updatedProduct = await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.qty } },
      { new: true },
    );

    if (updatedProduct && updatedProduct.stock <= updatedProduct.lowStockThreshold) {
      try {
        await notifyAdminLowStock(updatedProduct);
      } catch (err) {
        console.error(`Low stock WhatsApp alert failed for ${updatedProduct.title}:`, err);
      }
    }
  }

  if (!order.receiptUrl) {
    try {
      const receipt = await generateReceipt(order);
      order.receiptUrl = receipt.url;
    } catch (err) {
      console.error(`Receipt generation failed for order ${order.receiptNumber}:`, err);
    }
  }

  try {
    order.whatsappSent = await notifyCustomerOrderConfirmed(order);
  } catch (err) {
    console.error(`Customer WhatsApp confirmation failed for order ${order.receiptNumber}:`, err);
    order.whatsappSent = false;
  }

  await order.save();

  return order;
}
