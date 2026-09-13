import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageReorder from "@/components/admin/ImageReorder";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  createProduct,
  fetchProductByIdAdmin,
  updateProduct,
  uploadImages,
} from "@/services/products";
import type { ProductColour, ProductSeries, ProductStatus } from "@/types";

const SERIES_OPTIONS: ProductSeries[] = ["christian", "anime", "marvel_dc", "regular"];
const STATUS_OPTIONS: ProductStatus[] = ["draft", "published", "coming_soon"];

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  series: "regular" as ProductSeries,
  status: "draft" as ProductStatus,
  stock: "0",
  lowStockThreshold: "5",
  sizes: "",
  hasColourSwitcher: false,
  featured: false,
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [colours, setColours] = useState<ProductColour[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!id) return;

    fetchProductByIdAdmin(id)
      .then((product) => {
        setForm({
          title: product.title,
          description: product.description,
          price: String(product.price),
          series: product.series,
          status: product.status,
          stock: String(product.stock),
          lowStockThreshold: String(product.lowStockThreshold),
          sizes: product.sizes.join(", "),
          hasColourSwitcher: product.hasColourSwitcher,
          featured: product.featured,
        });
        setColours(product.colours);
        setImages(product.images);
      })
      .catch(() => setError("Could not load product"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const urls = await uploadImages(Array.from(files));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function addColourRow(): void {
    setColours((prev) => [...prev, { name: "", hex: "#dc143c" }]);
  }

  function updateColour(index: number, field: keyof ProductColour, value: string): void {
    setColours((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function removeColour(index: number): void {
    setColours((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.title || !form.description || !form.price) {
      setError("Title, description, and price are required");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      series: form.series,
      status: form.status,
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colours: colours.filter((c) => c.name && c.hex),
      hasColourSwitcher: form.hasColourSwitcher,
      images,
      featured: form.featured,
    };

    setSaving(true);

    try {
      if (isEditing && id) {
        await updateProduct(id, payload);
        setMessage("Product updated");
        navigate("/admin/products");
      } else {
        await createProduct(payload);
        setMessage("Product created. Form reset for the next one.");
        setForm(EMPTY_FORM);
        setColours([]);
        setImages([]);
      }
    } catch {
      setError("Could not save product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-white">{isEditing ? "Edit Product" : "New Product"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          required
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-sm text-white placeholder:text-brand-muted focus:border-brand-crimson focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Price (KES)"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.series}
            onChange={(e) => setForm((f) => ({ ...f, series: e.target.value as ProductSeries }))}
            className="rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-sm text-white focus:border-brand-crimson focus:outline-none"
          >
            {SERIES_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProductStatus }))}
            className="rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-sm text-white focus:border-brand-crimson focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <Input
          type="number"
          placeholder="Low stock threshold"
          value={form.lowStockThreshold}
          onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))}
        />

        <Input
          placeholder="Sizes, comma separated (S, M, L, XL)"
          value={form.sizes}
          onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-white">Colours</p>
            <button type="button" onClick={addColourRow} className="text-xs text-brand-crimson">
              + Add colour
            </button>
          </div>
          <div className="space-y-2">
            {colours.map((colour, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Name"
                  value={colour.name}
                  onChange={(e) => updateColour(index, "name", e.target.value)}
                />
                <input
                  type="color"
                  value={colour.hex}
                  onChange={(e) => updateColour(index, "hex", e.target.value)}
                  className="h-11 w-14 rounded border border-brand-border bg-brand-surface"
                />
                <button type="button" onClick={() => removeColour(index)} className="text-brand-muted hover:text-brand-crimson">
                  &times;
                </button>
              </div>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm text-brand-muted">
            <input
              type="checkbox"
              checked={form.hasColourSwitcher}
              onChange={(e) => setForm((f) => ({ ...f, hasColourSwitcher: e.target.checked }))}
            />
            Enable colour switcher on product page
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-white">Images (drag to reorder, first is hero)</p>
          <ImageReorder images={images} onChange={setImages} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="mt-3 text-sm text-brand-muted"
          />
          {uploading && <p className="mt-1 text-xs text-brand-muted">Uploading...</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-brand-muted">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          Feature on homepage
        </label>

        {error && <p className="text-sm text-brand-crimson">{error}</p>}
        {message && <p className="text-sm text-white">{message}</p>}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
