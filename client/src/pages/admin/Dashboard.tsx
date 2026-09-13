import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardStats, type DashboardStats } from "@/services/auth";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-white">Dashboard</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="clay-surface p-6">
          <p className="text-sm text-brand-muted">Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-brand-crimson">
            {formatKes(stats?.revenue ?? 0)}
          </p>
        </div>
        <div className="clay-surface p-6">
          <p className="text-sm text-brand-muted">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats?.orderCount ?? 0}</p>
        </div>
        <div className="clay-surface p-6">
          <p className="text-sm text-brand-muted">Pending Orders</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats?.pendingOrderCount ?? 0}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl text-white">Low Stock</h2>
        {stats?.lowStockProducts.length === 0 ? (
          <p className="mt-3 text-sm text-brand-muted">Nothing is low on stock right now.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {stats?.lowStockProducts.map((product) => (
              <Link
                key={product._id}
                to={`/admin/products/${product._id}/edit`}
                className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-surface px-4 py-3 hover:border-brand-crimson"
              >
                <span className="text-sm text-white">{product.title}</span>
                <span className="text-sm text-brand-crimson">{product.stock} left</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
