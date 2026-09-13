import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { fetchAllOrdersAdmin, updateOrderPaymentStatus, updateOrderStatus } from "@/services/orders";
import type { Order, OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  useEffect(() => {
    fetchAllOrdersAdmin()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, orderStatus: OrderStatus): Promise<void> {
    const updated = await updateOrderStatus(id, orderStatus);
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  }

  async function handleMarkPaid(id: string): Promise<void> {
    if (!confirm("Confirm payment has been received on the Till for this order?")) return;

    setMarkingPaid(id);
    try {
      const updated = await updateOrderPaymentStatus(id, "paid");
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } finally {
      setMarkingPaid(null);
    }
  }

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-white">Orders</h1>

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl border border-brand-border bg-brand-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mono-ref text-white">{order.receiptNumber}</p>
                <p className="text-xs text-brand-muted">
                  {order.customer.name} &bull; {order.customer.phone}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.paymentStatus === "paid"
                      ? "bg-green-900 text-green-300"
                      : order.paymentStatus === "failed"
                        ? "bg-red-900 text-red-300"
                        : "bg-brand-border text-brand-muted"
                  }`}
                >
                  {order.paymentStatus}
                </span>

                {order.paymentStatus !== "paid" && (
                  <Button
                    variant="ghost"
                    onClick={() => handleMarkPaid(order._id)}
                    disabled={markingPaid === order._id}
                    className="px-4 py-2 text-xs"
                  >
                    {markingPaid === order._id ? "Marking..." : "Mark Paid"}
                  </Button>
                )}

                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-sm text-white"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="mt-3 text-sm font-semibold text-brand-crimson">{formatKes(order.total)}</p>

            {order.receiptUrl && (
              <a
                href={order.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-white underline"
              >
                Download receipt
              </a>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-brand-muted">No orders yet.</p>}
      </div>
    </div>
  );
}
