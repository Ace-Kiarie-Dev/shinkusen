import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import { fetchProducts } from "@/services/products";
import type { Product, ProductSeries } from "@/types";

const TABS: { key: ProductSeries | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "christian", label: "Christian" },
  { key: "anime", label: "Anime" },
  { key: "marvel_dc", label: "Marvel / DC" },
  { key: "regular", label: "Regular" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSeries = (searchParams.get("series") as ProductSeries | null) ?? "all";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeSeries === "all" ? undefined : { series: activeSeries })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeSeries]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Shop</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSearchParams(tab.key === "all" ? {} : { series: tab.key })}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeSeries === tab.key
                ? "bg-brand-crimson text-white"
                : "border border-brand-border text-brand-muted hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-16 text-center text-brand-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="mt-16 text-center text-brand-muted">No products found in this series yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
