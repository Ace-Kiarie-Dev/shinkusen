import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { trackOrderByReceipt, trackOrdersByPhone } from "@/services/orders";
import type { Order } from "@/types";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

const STATUS_LABEL: Record<Order["orderStatus"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("receipt") ?? "");
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError("");
    setLoading(true);
    setOrders([]);

    try {
      if (query.toUpperCase().startsWith("SKN")) {
        const order = await trackOrderByReceipt(query.trim());
        setOrders([order]);
      } else {
        const found = await trackOrdersByPhone(query.trim());
        if (found.length === 0) {
          setError("No orders found for that phone number.");
        }
        setOrders(found);
      }
    } catch {
      setError("Order not found. Check your receipt number or phone number.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Track Order</h1>
      <p className="mt-2 text-sm text-brand-muted">
        Look up your order by receipt number (SKN-2026-0001) or phone number.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-3">
        <Input
          placeholder="Receipt number or phone number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-brand-crimson">{error}</p>}

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl border border-brand-border bg-brand-surface p-5">
            <div className="flex items-center justify-between">
              <p className="mono-ref text-white">{order.receiptNumber}</p>
              <span className="rounded-full bg-brand-crimson/20 px-3 py-1 text-xs font-semibold text-brand-crimson">
                {STATUS_LABEL[order.orderStatus]}
              </span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">Payment: {order.paymentStatus}</p>
            <ul className="mt-3 space-y-1 text-sm text-white">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.qty}x {item.title} ({item.size}, {item.colour})
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold text-brand-crimson">Total {formatKes(order.total)}</p>
            {order.receiptUrl && (
              <a
                href={order.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-white underline"
              >
                Download receipt
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
