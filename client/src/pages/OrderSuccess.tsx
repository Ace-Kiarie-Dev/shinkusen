import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { trackOrderByReceipt } from "@/services/orders";
import type { Order } from "@/types";

export default function OrderSuccess() {
  const { receiptNumber } = useParams<{ receiptNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!receiptNumber) return;
    trackOrderByReceipt(receiptNumber)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [receiptNumber]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-brand-crimson">Payment received</p>
      <h1 className="font-display mt-2 text-4xl text-white">Thank you</h1>
      <p className="mono-ref mt-4 text-lg text-white">{receiptNumber}</p>
      <p className="mt-4 text-sm text-brand-muted">
        A confirmation has been sent to your WhatsApp. You can track your order any time with your
        receipt number or phone number.
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
