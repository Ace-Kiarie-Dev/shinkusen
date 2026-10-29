import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import HeroParticles from "@/components/ui/HeroParticles";
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
      <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0a0a0a]">
        {/* z-0: canvas background + crimson radial glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 50%, rgba(220,20,60,0.08) 0%, transparent 60%), #0a0a0a",
          }}
        />

        {/* z-0: background particles, painted above the opaque canvas layer above so they're visible */}
        <HeroParticles />

        {/* z-1: SHINKU */}
        <h1 className="absolute left-[4%] top-[12%] z-10 text-[clamp(3rem,16vw,5rem)] leading-[0.85] tracking-[0.02em] text-white font-display animate-[slideInLeft_0.6s_cubic-bezier(0.22,1,0.36,1)_0ms_both] md:top-[8%] md:text-[clamp(4.5rem,12vw,10rem)]">
          SHINKU
        </h1>

        {/* z-2: SEN */}
        <h1 className="absolute right-[3%] bottom-[14%] z-10 text-[clamp(3rem,16vw,5rem)] leading-[0.85] tracking-[0.02em] text-brand-crimson font-display animate-[slideInRight_0.6s_cubic-bezier(0.22,1,0.36,1)_400ms_both] md:bottom-[8%] md:text-[clamp(5rem,13vw,11rem)]">
          SEN
        </h1>

        {/* z-3: mannequin, in front of both words */}
        <img
          src="/src/assets/hero-image-main.png"
          alt="SHINKUSEN mannequin apparel"
          className="absolute left-1/2 top-1/2 z-30 w-[68vw] object-contain md:w-[42vw] md:max-w-[550px] md:min-w-[280px]"
          style={{
            animation:
              "scaleInHero 0.8s cubic-bezier(0.22,1,0.36,1) 200ms both, heroFloat 6s ease-in-out 1.2s infinite",
          }}
        />

        {/* z-5: crimson vertical line */}
        <div className="absolute left-0 top-0 z-40 h-full w-[2px] origin-top bg-brand-crimson animate-[drawLine_1s_cubic-bezier(0.22,1,0.36,1)_500ms_both]" />

        {/* z-4: metadata labels */}
        <div className="absolute left-[4%] top-[6%] z-40 animate-[fadeInUp_0.6s_ease_700ms_both]">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#888888]">
            NAIROBI, KENYA
          </p>
          <div className="mt-1 h-[2px] w-6 bg-brand-crimson" />
        </div>

        <p className="absolute bottom-[18%] left-[4%] z-40 font-body text-[11px] italic text-[#888888] animate-[fadeInUp_0.6s_ease_700ms_both]">
          Isaiah 1:18
        </p>

        <p className="absolute right-[3%] top-1/2 z-40 hidden -translate-y-1/2 rotate-90 font-mono text-[11px] text-[#444444] animate-[fadeInUp_0.6s_ease_700ms_both] md:block">
          狭い道
        </p>

        <div className="absolute bottom-[4%] right-[4%] z-40 hidden text-right font-mono text-[8px] uppercase tracking-[0.15em] text-[#333333] animate-[fadeInUp_0.6s_ease_700ms_both] md:block">
          <p>MATTHEW 7:14</p>
          <p>// THE NARROW PATH</p>
        </div>

        <p className="absolute right-[4%] top-[6%] z-40 hidden font-mono text-[8px] tracking-[0.25em] text-[#444444] animate-[fadeInUp_0.6s_ease_700ms_both] md:block">
          CREATIVITY. FAITH. FASHION.
        </p>

        {/* z-4: tagline + CTA */}
        <div className="absolute bottom-[16%] left-[4%] z-40 animate-[fadeInUp_0.6s_ease_900ms_both] md:bottom-[10%]">
          <p className="mb-3 font-body text-[11px] uppercase tracking-[0.2em] text-[#888888]">
            SILENT FAITH. LOUD CULTURE.
          </p>
          <Link
            to="/shop"
            className="inline-block cursor-pointer border-none bg-brand-crimson px-9 py-3 font-display text-sm tracking-[0.1em] text-white transition-all duration-200 [transition-timing-function:ease] hover:-translate-y-px hover:bg-[#ff2952]"
          >
            SHOP THE DROP
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
