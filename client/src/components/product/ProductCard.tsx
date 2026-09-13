import { Link } from "react-router-dom";
import type { Product } from "@/types";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const hero = product.images[0];

  return (
    <Link to={`/shop/${product.slug}`} className="clay-surface group block overflow-hidden p-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-brand-black">
        {hero ? (
          <img
            src={hero}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-muted">
            No image
          </div>
        )}
        {product.status === "coming_soon" && (
          <div className="absolute left-3 top-3 rounded-full bg-brand-crimson px-3 py-1 text-xs font-bold text-white">
            Coming Soon
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2 px-1">
        <div>
          <h3 className="text-sm font-semibold text-white">{product.title}</h3>
          <p className="mt-1 text-sm text-brand-muted">{formatKes(product.price)}</p>
        </div>

        {product.colours.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {product.colours.slice(0, 4).map((colour) => (
              <span
                key={colour.name}
                title={colour.name}
                className="h-3 w-3 rounded-full border border-brand-border"
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
