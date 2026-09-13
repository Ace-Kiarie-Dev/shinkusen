import type { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";

export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  const paidOrders = await Order.find({ paymentStatus: "paid" });
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = await Order.countDocuments();
  const pendingOrderCount = await Order.countDocuments({ orderStatus: "pending" });

  const lowStockProducts = await Product.find({
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
  }).sort({ stock: 1 });

  res.json({
    success: true,
    data: {
      revenue,
      orderCount,
      pendingOrderCount,
      lowStockProducts,
    },
  });
}
