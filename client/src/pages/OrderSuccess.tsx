import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { trackOrderByReceipt } from "@/services/orders";
import { fetchSettings } from "@/services/auth";
import type { Order, Settings } from "@/types";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function OrderSuccess() {
  const { receiptNumber } = useParams<{ receiptNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    if (!receiptNumber) return;
    trackOrderByReceipt(receiptNumber)
      .then(setOrder)
      .catch(() => setOrder(null));
    fetchSettings()
      .then((data) => setSettings(data ?? null))
      .catch(() => setSettings(null));
  }, [receiptNumber]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-brand-crimson">Order placed</p>
      <h1 className="font-display mt-2 text-4xl text-white">Thank you</h1>
      <p className="mono-ref mt-4 text-lg text-white">{receiptNumber}</p>

      {settings?.mpesaTillNumber && (
        <div className="clay-surface mt-8 p-6 text-left">
          <p className="text-sm font-semibold text-brand-crimson">Complete your payment</p>
          <p className="mt-2 text-sm text-white">
            Pay via M-Pesa Buy Goods. Till: <span className="mono-ref">{settings.mpesaTillNumber}</span> (
            {settings.mpesaTillName})
          </p>
          {order && (
            <p className="mt-2 text-sm text-white">
              Amount: <span className="font-semibold text-brand-crimson">{formatKes(order.total)}</span>
            </p>
          )}
          <p className="mt-3 text-sm text-brand-muted">
            Pay the exact total to this Till. Your order is confirmed once payment is verified, and a
            confirmation with your receipt will be sent to your WhatsApp.
          </p>
        </div>
      )}

      <p className="mt-6 text-sm text-brand-muted">
        You can track your order any time with your receipt number or phone number.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        {order?.receiptUrl && (
          <a href={order.receiptUrl} target="_blank" rel="noreferrer">
            <Button>Download Receipt</Button>
          </a>
        )}
        <Link to="/shop">
          <Button variant="ghost">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
