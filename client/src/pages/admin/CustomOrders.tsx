import { useEffect, useState } from "react";
import { fetchAllCustomOrdersAdmin, updateCustomOrderStatus } from "@/services/orders";
import type { CustomOrder, CustomOrderStatus } from "@/types";

const STATUS_OPTIONS: CustomOrderStatus[] = ["pending", "in_review", "confirmed", "completed", "cancelled"];

export default function CustomOrders() {
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCustomOrdersAdmin()
      .then(setCustomOrders)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, status: CustomOrderStatus): Promise<void> {
    const updated = await updateCustomOrderStatus(id, status);
    setCustomOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  }

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-white">Custom Orders</h1>

      <div className="mt-6 space-y-3">
        {customOrders.map((order) => (
          <div key={order._id} className="rounded-xl border border-brand-border bg-brand-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mono-ref text-white">{order.receiptNumber}</p>
                <p className="text-xs text-brand-muted">
                  {order.customer.name} &bull; {order.customer.phone}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value as CustomOrderStatus)}
                className="rounded-lg border border-brand-border bg-brand-black px-3 py-2 text-sm text-white"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 text-sm text-white">
              <p>Garment: {order.garmentType}</p>
              <p>Placement: {order.placement.replace(/_/g, " ")}</p>
              {order.notes && <p className="mt-1 text-brand-muted">{order.notes}</p>}
            </div>
          </div>
        ))}
        {customOrders.length === 0 && <p className="text-brand-muted">No custom order requests yet.</p>}
      </div>
    </div>
  );
}
