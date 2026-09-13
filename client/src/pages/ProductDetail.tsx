import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageGallery from "@/components/product/ImageGallery";
import ColourSwitcher from "@/components/product/ColourSwitcher";
import SizeGuideModal from "@/components/product/SizeGuideModal";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { fetchProductBySlug } from "@/services/products";
import type { Product } from "@/types";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        setSize(p.sizes[0] ?? "");
        setColour(p.colours[0]?.name ?? "");
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="py-24 text-center text-brand-muted">Loading...</p>;
  }

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-brand-muted">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-brand-crimson">
          Back to shop
        </Link>
      </div>
    );
  }

  function handleAddToCart(): void {
    if (!product) return;

    addItem({
      productId: product._id,
      title: product.title,
      slug: product.slug,
      image: product.images[0] ?? "",
      size,
      colour,
      qty,
      unitPrice: product.price,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const isComingSoon = product.status === "coming_soon";
  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <ImageGallery images={product.images} title={product.title} />

        <div>
          <h1 className="font-display text-4xl text-white">{product.title}</h1>
          <p className="mt-2 text-xl text-brand-crimson">{formatKes(product.price)}</p>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Size</p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-brand-muted underline hover:text-white"
                >
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                      size === s
                        ? "border-brand-crimson text-brand-crimson"
                        : "border-brand-border text-white hover:border-brand-crimson"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colours.length > 0 && product.hasColourSwitcher && (
            <div className="mt-6">
              <ColourSwitcher colours={product.colours} selected={colour} onSelect={setColour} />
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-10 w-10 rounded-full border border-brand-border text-white"
            >
              &minus;
            </button>
            <span className="w-8 text-center text-white">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="h-10 w-10 rounded-full border border-brand-border text-white"
            >
              +
            </button>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={isComingSoon || outOfStock}
              className="flex-1"
            >
              {isComingSoon ? "Coming Soon" : outOfStock ? "Out of Stock" : added ? "Added!" : "Add to Cart"}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/cart")}>
              View Cart
            </Button>
          </div>
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
