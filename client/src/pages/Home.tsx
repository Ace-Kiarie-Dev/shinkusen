import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";
import { fetchProducts } from "@/services/products";
import type { Product, ProductSeries } from "@/types";

const PILLARS = [
  {
    title: "Faith",
    body: "Rooted in scripture, worn without apology. Isaiah 1:18 is our anchor.",
  },
  {
    title: "Anime",
    body: "Streetwear that speaks the language of the culture we grew up on.",
  },
  {
    title: "Kenyan Identity",
    body: "Designed, printed, and shipped out of Nairobi. Made for us, by us.",
  },
];

const SERIES: { key: ProductSeries; label: string }[] = [
  { key: "christian", label: "Christian" },
  { key: "anime", label: "Anime" },
  { key: "marvel_dc", label: "Marvel / DC" },
  { key: "regular", label: "Regular" },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((products) => setFeatured(products.filter((p) => p.featured).slice(0, 4)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface to-brand-black px-6 py-28 text-center">
        <p className="text-scripture text-sm">Isaiah 1:18</p>
        <h1 className="font-display mt-4 text-6xl tracking-wide text-white md:text-8xl">
          SHINKU<span className="text-brand-crimson">SEN</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-muted">
          Faith meets streetwear. Custom apparel from Nairobi, built at the intersection of
          Christian faith, anime culture, and Kenyan identity.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/shop">
            <Button>Shop the Drop</Button>
          </Link>
          <Link to="/customize">
            <Button variant="ghost">Customize</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="clay-surface p-8 text-center">
              <h3 className="font-display text-2xl text-brand-crimson">{pillar.title}</h3>
              <p className="mt-3 text-sm text-brand-muted">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl text-white">Featured</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl text-white">Series</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {SERIES.map((series) => (
            <Link
              key={series.key}
              to={`/shop?series=${series.key}`}
              className="clay-surface flex items-center justify-center p-10 text-center"
            >
              <span className="font-display text-xl text-white">{series.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
