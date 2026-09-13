import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-surface">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl tracking-wider text-white">SHINKUSEN</p>
            <p className="mt-2 text-sm text-brand-muted">A Nesture-X Original, from Nairobi.</p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-brand-muted">
            <Link to="/shop" className="hover:text-white">
              Shop
            </Link>
            <Link to="/customize" className="hover:text-white">
              Customize
            </Link>
            <Link to="/track" className="hover:text-white">
              Track Order
            </Link>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-scripture text-sm">
              &ldquo;Come now, let us reason together, saith the LORD: though your sins be as scarlet,
              they shall be as white as snow.&rdquo; &mdash; Isaiah 1:18
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-brand-muted">
          &copy; {new Date().getFullYear()} SHINKUSEN. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
