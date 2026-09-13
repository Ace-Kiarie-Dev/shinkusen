import type { Request, Response } from "express";
import Order from "../models/Order";
import { markOrderPaid } from "../services/orderFulfillment.service";

interface StkCallbackItem {
  Name: string;
  Value?: string | number;
}

interface StkCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: StkCallbackItem[];
      };
    };
  };
}

function extractMetadataValue(items: StkCallbackItem[] | undefined, name: string): string | undefined {
  const item = items?.find((entry) => entry.Name === name);
  return item?.Value !== undefined ? String(item.Value) : undefined;
}

// Dormant while STK Push is disabled for the manual-pay launch. Kept working
// so re-enabling mpesa.service.ts later does not require rebuilding this flow.
export async function mpesaCallback(req: Request, res: Response): Promise<void> {
  const body = req.body as StkCallbackBody;
  const callback = body?.Body?.stkCallback;

  if (!callback) {
    res.status(200).json({ success: true });
    return;
  }

  const order = await Order.findOne({ mpesaCheckoutRequestId: callback.CheckoutRequestID });

  if (!order) {
    console.warn("M-Pesa callback received for unknown CheckoutRequestID:", callback.CheckoutRequestID);
    res.status(200).json({ success: true });
    return;
  }

  if (order.paymentStatus === "paid") {
    res.status(200).json({ success: true });
    return;
  }

  if (callback.ResultCode === 0) {
    const mpesaRef = extractMetadataValue(callback.CallbackMetadata?.Item, "MpesaReceiptNumber");

    order.paymentStatus = "paid";
    order.mpesaRef = mpesaRef ?? null;

    try {
      await markOrderPaid(order);
    } catch (err) {
      console.error(`Failed to fully process paid order ${order.receiptNumber}:`, err);
      await order.save();
    }
  } else {
    order.paymentStatus = "failed";
    await order.save();
    console.warn(`M-Pesa payment failed for order ${order.receiptNumber}: ${callback.ResultDesc}`);
  }

  res.status(200).json({ success: true });
}
