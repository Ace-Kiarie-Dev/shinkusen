import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { deleteProduct, fetchAllProductsAdmin } from "@/services/products";
import type { Product } from "@/types";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  function load(): void {
    setLoading(true);
    fetchAllProductsAdmin()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string): Promise<void> {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white">Products</h1>
        <Link to="/admin/products/new">
          <Button>New Product</Button>
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-brand-muted">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-brand-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-surface text-brand-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Series</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-brand-border text-white">
                  <td className="px-4 py-3">{product.title}</td>
                  <td className="px-4 py-3 text-brand-muted">{product.series}</td>
                  <td className="px-4 py-3 text-brand-muted">{product.status}</td>
                  <td className="px-4 py-3">{formatKes(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock <= product.lowStockThreshold ? "text-brand-crimson" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="mr-4 text-brand-crimson hover:underline"
                    >
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="text-brand-muted hover:text-brand-crimson">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="p-6 text-center text-brand-muted">No products yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
