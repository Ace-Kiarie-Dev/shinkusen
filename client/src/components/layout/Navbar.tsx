import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/customize", label: "Customize" },
  { to: "/track", label: "Track Order" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    function onScroll(): void {
      setIsScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`glass-navbar sticky top-0 z-50 ${isScrolled ? "is-scrolled" : ""}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-wider text-white">
          SHINKUSEN
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-brand-crimson" : "text-white hover:text-brand-crimson"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <Link to="/cart" className="relative flex items-center gap-2 text-white">
          <span className="text-sm font-medium">Cart</span>
          {itemCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
