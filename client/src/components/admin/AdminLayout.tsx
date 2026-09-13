import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/custom-orders", label: "Custom Orders" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-brand-black">
      <aside className="w-64 shrink-0 border-r border-brand-border bg-brand-surface p-6">
        <p className="font-display text-2xl text-white">SHINKUSEN</p>
        <p className="text-xs text-brand-muted">Admin</p>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-crimson text-white" : "text-brand-muted hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 border-t border-brand-border pt-4">
          <p className="text-xs text-brand-muted">{user?.email}</p>
          <button onClick={logout} className="mt-2 text-sm text-brand-crimson hover:underline">
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
